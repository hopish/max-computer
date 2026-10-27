
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "max_computers",
  waitForConnections: true,
  connectionLimit: 10,
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      category VARCHAR(100) NOT NULL DEFAULT 'Accessories',
      price DECIMAL(12,2) NOT NULL DEFAULT 0,
      image TEXT,
      description TEXT,
      stock INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(200) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      address TEXT,
      items JSON NOT NULL,
      total DECIMAL(12,2) NOT NULL,
      status VARCHAR(40) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await pool.query(
    "SELECT COUNT(*) AS total FROM products"
  );

  if (Number(rows[0].total) === 0) {
    const sampleProducts = [
      [
        "HP Laptop",
        "Laptops",
        450000,
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
        "Reliable laptop for business and school.",
        10,
      ],
      [
        "Smartphone",
        "Phones",
        250000,
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
        "Modern smartphone with a beautiful display.",
        15,
      ],
      [
        "Wireless Headphones",
        "Accessories",
        35000,
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        "Comfortable wireless headphones.",
        20,
      ],
      [
        "Computer Monitor",
        "Accessories",
        180000,
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
        "A clear display for work and entertainment.",
        8,
      ],
    ];

    await pool.query(
      `INSERT INTO products
       (name, category, price, image, description, stock)
       VALUES ?`,
      [sampleProducts]
    );
  }

  const defaultCategories = [
    ["Laptops"],
    ["Phones"],
    ["Accessories"],
  ];

  await pool.query(
    `INSERT IGNORE INTO categories (name) VALUES ?`,
    [defaultCategories]
  );

  console.log("MySQL database initialized.");
}

app.get("/", (req, res) => {
  res.json({
    message: "Max Computers and Phones API is running.",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed.",
    });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT id, name, category, price, image, description, stock
       FROM products
       ORDER BY created_at DESC, id DESC`
    );

    res.json(products);
  } catch (error) {
    console.error("Products error:", error.message);
    res.status(500).json({ error: "Unable to load products." });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT id, name FROM categories ORDER BY name"
    );

    res.json(categories);
  } catch (error) {
    console.error("Categories error:", error.message);
    res.status(500).json({ error: "Unable to load categories." });
  }
});

// Add a product. Protect this endpoint before using it in production.
app.post("/api/products", async (req, res) => {
  try {
    const { name, category, price, image, description, stock } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        error: "A product name and valid non-negative price are required.",
      });
    }

    const productCategory =
      typeof category === "string" && category.trim()
        ? category.trim()
        : "Accessories";

    const [result] = await pool.query(
      `INSERT INTO products
       (name, category, price, image, description, stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        productCategory,
        Number(price),
        typeof image === "string" ? image : "",
        typeof description === "string" ? description : "",
        Math.max(0, Math.floor(Number(stock) || 0)),
      ]
    );

    await pool.query(
      "INSERT IGNORE INTO categories (name) VALUES (?)",
      [productCategory]
    );

    res.status(201).json({
      message: "Product added successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Add product error:", error.message);
    res.status(500).json({ error: "Unable to add product." });
  }
});

// Record an order in the database.
app.post("/api/orders", async (req, res) => {
  const { customer_name, phone, address, items } = req.body;

  if (
    typeof customer_name !== "string" ||
    !customer_name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      error: "Customer name, phone and order items are required.",
    });
  }

  if (
    items.length > 100 ||
    items.some(
      (item) =>
        !Number.isInteger(Number(item.id)) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1 ||
        Number(item.quantity) > 1000
    )
  ) {
    return res.status(400).json({ error: "Invalid order items." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let total = 0;
    const confirmedItems = [];

    for (const item of items) {
      const [rows] = await connection.query(
        `SELECT id, name, price, stock
         FROM products WHERE id = ? FOR UPDATE`,
        [Number(item.id)]
      );

      if (!rows.length) {
        throw new Error(`Product ${item.id} was not found.`);
      }

      const product = rows[0];
      const quantity = Number(item.quantity);

      if (Number(product.stock) < quantity) {
        throw new Error(`${product.name} has insufficient stock.`);
      }

      const price = Number(product.price);
      total += price * quantity;

      confirmedItems.push({
        id: product.id,
        name: product.name,
        price,
        quantity,
      });

      await connection.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [quantity, product.id]
      );
    }

    const [result] = await connection.query(
      `INSERT INTO orders
       (customer_name, phone, address, items, total)
       VALUES (?, ?, ?, ?, ?)`,
      [
        customer_name.trim(),
        phone.trim(),
        typeof address === "string" ? address : "",
        JSON.stringify(confirmedItems),
        total,
      ]
    );

    await connection.commit();

    res.status(201).json({
      message: "Order saved successfully.",
      order_id: result.insertId,
      total,
      items: confirmedItems,
    });
  } catch (error) {
    await connection.rollback();

    console.error("Order error:", error.message);

    res.status(400).json({
      error: error.message || "Unable to save order.",
    });
  } finally {
    connection.release();
  }
});

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
