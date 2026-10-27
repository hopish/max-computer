
import React, { useMemo, useState } from "react";

const PHONE = "250784294899";
const EMAIL = "fidelemaxwell@gmail.com";
const INSTAGRAM = "https://www.instagram.com/max_computer_250/";

const PRODUCTS = [
  { id: 1, name: "HP EliteBook", category: "Laptops", price: 650000, specs: "Core i5 • 8GB RAM • 256GB SSD", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85" },
  { id: 2, name: "iPhone 13", category: "Phones", price: 650000, specs: "128GB • Premium camera", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=85" },
  { id: 3, name: "Apple iPad", category: "Tablets", price: 520000, specs: "Portable • Work and entertainment", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=85" },
  { id: 4, name: "ASUS Gaming Laptop", category: "Gaming", price: 1450000, specs: "High-performance gaming", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=700&q=85" },
  { id: 5, name: "Wireless Headphones", category: "Accessories", price: 45000, specs: "Bluetooth • Music and calls", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85" },
  { id: 6, name: "Dell Latitude", category: "Laptops", price: 580000, specs: "Business laptop • SSD", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=85" },
  { id: 7, name: "Samsung Galaxy", category: "Phones", price: 420000, specs: "Android • Modern display", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85" },
  { id: 8, name: "Galaxy Tablet", category: "Tablets", price: 300000, specs: "Portable Android tablet", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=700&q=85" },
  { id: 9, name: "Wireless Mouse", category: "Accessories", price: 18000, specs: "Wireless • Smooth control", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=85" },
  { id: 10, name: "HP Printer", category: "Printers", price: 160000, specs: "For home, school and office", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=700&q=85" },
  { id: 11, name: "MacBook Air", category: "Laptops", price: 1250000, specs: "Slim design • Everyday work", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=85" },
  { id: 12, name: "Redmi Smartphone", category: "Phones", price: 220000, specs: "Android • Everyday performance", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=700&q=85" },
  { id: 13, name: "Gaming Keyboard", category: "Accessories", price: 55000, specs: "RGB lighting • Gaming keys", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=85" },
  { id: 14, name: "Wi-Fi Router", category: "Networking", price: 65000, specs: "Wireless network connectivity", image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=700&q=85" },
  { id: 15, name: "Desktop Monitor", category: "Accessories", price: 180000, specs: "Display for work and study", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=85" },
  { id: 16, name: "Google Pixel", category: "Phones", price: 550000, specs: "Android • Smart camera", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=85" },
  { id: 17, name: "Lenovo ThinkPad", category: "Laptops", price: 490000, specs: "Business laptop • SSD", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=85" },
  { id: 18, name: "USB-C Hub", category: "Accessories", price: 25000, specs: "Multiport connection adapter", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=700&q=85" },
  { id: 19, name: "Gaming Controller", category: "Gaming", price: 65000, specs: "For compatible gaming devices", image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=700&q=85" },
  { id: 20, name: "HP Pavilion Laptop", category: "Laptops", price: 720000, specs: "For home, school and office", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85" }
];

const CATEGORIES = [
  "All", "Laptops", "Phones", "Tablets",
  "Accessories", "Gaming", "Printers", "Networking"
];

const CATEGORY_ICONS = ["▦", "▱", "▯", "▣", "⌘", "🎮", "▤", "◉"];

const money = (amount) =>
  `${new Intl.NumberFormat("en-RW").format(amount)} RWF`;

const styles = `
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:95px}
body{margin:0;background:#020914;color:#f4f7ff;font-family:Arial,Helvetica,sans-serif}
button,input{font:inherit}
button{cursor:pointer}
a{color:inherit;text-decoration:none}
.wrap{width:96%;max-width:1700px;margin:auto}

.header{position:sticky;top:0;z-index:20;background:#031024f5;border-bottom:1px solid #164475;backdrop-filter:blur(12px)}
.nav{min-height:82px;display:flex;align-items:center;justify-content:space-between;gap:18px}
.brand{display:flex;align-items:center;flex:0 1 250px;min-width:150px;text-decoration:none}
.brandName{display:flex;flex-direction:column;gap:4px;line-height:1.2}
.brandName strong{font-size:27px;font-weight:900;letter-spacing:3px;color:#fff}
.brandName span{font-size:10px;font-weight:700;letter-spacing:1.5px;color:#35cfff}

.links{display:flex;align-items:center;gap:16px;font-size:12px;white-space:nowrap}
.links a{transition:color .2s}
.links a:hover{color:#40e1ff}
.search{width:225px;max-width:100%;border:1px solid #1169b5;border-radius:25px;padding:12px 15px;color:white;background:#06172b;outline:none}
.search:focus{border-color:#38dfff}
.cartBtn{flex-shrink:0;border:1px solid #1368aa;border-radius:10px;padding:12px;color:white;background:#092b4d}
.count{display:inline-block;min-width:22px;padding:4px 6px;margin-left:5px;border-radius:20px;background:#ff3158;text-align:center;font-size:11px}

.hero{display:block;width:100%;overflow:hidden;background:#000;line-height:0}
.heroImage{display:block;width:100%;height:auto;object-fit:contain}

.categories{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:10px;padding:15px 12px;margin:12px 0;border:1px solid #193b5d;border-radius:13px;background:#081a2d}
.cat{display:flex;flex-direction:column;align-items:center;gap:9px;padding:5px 2px;color:#eaf3ff;border:0;background:transparent;font-size:11px}
.catIcon{width:45px;height:45px;display:grid;place-items:center;border:1px solid #ffffff28;border-radius:50%;background:linear-gradient(145deg,#145a91,#101e50);color:#65e5ff;font-size:21px}
.cat.active .catIcon,.cat:hover .catIcon{border-color:#40e0ff;background:linear-gradient(145deg,#087cba,#392b96)}

.layout{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:17px;align-items:start}
.sectionTitle{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:20px 2px 15px}
.sectionTitle h2{font-size:22px;margin:0 0 6px}
.sub{color:#aebfd6;font-size:12px;line-height:1.6}
.viewAll{border:1px solid #087fca;background:transparent;color:#44d9ff;border-radius:22px;padding:9px 13px;font-size:11px}

.products{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.product{min-width:0;overflow:hidden;border:1px solid #1e4265;border-radius:12px;background:linear-gradient(145deg,#11263c,#071727);transition:transform .2s,border-color .2s}
.product:hover{transform:translateY(-3px);border-color:#14bdec}
.photo{height:145px;position:relative;overflow:hidden;background:#10253d}
.photo img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .25s}
.product:hover .photo img{transform:scale(1.06)}
.tag{position:absolute;top:8px;left:8px;padding:5px 8px;border-radius:7px;background:#087eff;color:white;font-size:9px}
.info{padding:11px}
.info h3{min-height:33px;margin:0 0 6px;font-size:12px;line-height:1.45}
.spec{min-height:32px;color:#afc4dc;font-size:10px;line-height:1.5}
.stars{margin-top:7px;color:#ffcb37;font-size:12px}
.price{margin:8px 0 10px;color:white;font-size:13px;font-weight:900;overflow-wrap:anywhere}
.stock{margin-bottom:8px;color:#65e8b6;font-size:9px}
.addBtn{width:100%;border:0;border-radius:7px;padding:9px 4px;background:linear-gradient(90deg,#ffdc42,#ffb126);color:#101a27;font-size:10px;font-weight:900}
.addBtn:hover{filter:brightness(1.08)}
.side{position:sticky;top:95px;padding-top:20px}
.panel{margin-bottom:12px;padding:15px;border:1px solid #13568a;border-radius:13px;background:linear-gradient(150deg,#0c2139,#031322)}
.panel h3{margin:0 0 13px;font-size:14px}
.line{display:grid;grid-template-columns:46px minmax(0,1fr);gap:9px;padding:10px 0;border-bottom:1px solid #15344e}
.line img{width:46px;height:46px;object-fit:cover;border-radius:6px}
.line strong{display:block;font-size:10px;line-height:1.5}
.line small{display:block;margin-top:4px;color:#b6cae0;font-size:10px}
.qty{display:flex;align-items:center;gap:9px;margin-top:7px;font-size:11px}
.qty button{width:23px;height:22px;border:1px solid #225076;border-radius:5px;color:white;background:#05192d}
.totalRow{display:flex;justify-content:space-between;gap:8px;margin:9px 0;color:#c6d8eb;font-size:10px}
.totalRow.final{color:#ffdb37;font-size:14px;font-weight:bold}
.whatsapp{width:100%;margin-top:8px;padding:12px 6px;border:0;border-radius:25px;background:#06bd70;color:white;font-size:11px;font-weight:900}
.whatsapp:hover{background:#079d60}
.clearBtn{width:100%;margin-top:8px;padding:9px;border:1px solid #0877c4;border-radius:20px;color:#54d9ff;background:transparent;font-size:10px}
.contact{color:#d4e2f1;font-size:11px;line-height:2.1;overflow-wrap:anywhere}
.contact a{color:#7ce7ff}
.slogan{margin-top:13px;color:#ffdb35;text-align:center;font-size:19px;font-weight:800;font-style:italic;line-height:1.4}
.empty{padding:35px 15px;border:1px dashed #24516f;border-radius:12px;color:#a9c1d7;text-align:center}

.notice{position:fixed;right:20px;bottom:20px;z-index:50;padding:13px 18px;border:1px solid #1c9c80;border-radius:10px;background:#073c32;color:#eafff6;box-shadow:0 8px 30px #0006;font-size:13px}
.footer{margin-top:25px;padding:22px 0;border-top:1px solid #17466b;background:#031020;color:#b7cbe0;font-size:10px}
.footerInner{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.footer strong{color:white;font-size:18px;letter-spacing:2px}
.footer a{margin:0 4px;color:#69dfff}

@media(max-width:1200px){
  .links{gap:10px}
  .search{width:180px}
  .products{grid-template-columns:repeat(3,minmax(0,1fr))}
  .layout{grid-template-columns:minmax(0,1fr) 260px}
  .brand{flex-basis:200px}
}
@media(max-width:950px){
  .links{display:none}
  .layout{grid-template-columns:1fr}
  .side{position:static;display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .side .panel{margin-bottom:0}
  .products{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(max-width:600px){
  .wrap{width:94%}
  .nav{min-height:65px;flex-wrap:wrap;gap:9px;padding:9px 0}
  .brand{flex:1 1 140px;min-width:130px}
  .brandName strong{font-size:20px}
  .brandName span{font-size:8px;letter-spacing:1px}
  .search{flex:1;width:100px;min-width:100px;padding:10px}
  .categories{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px 3px;padding:12px 4px}
  .cat{font-size:10px}
  .catIcon{width:40px;height:40px;font-size:19px}
  .products{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
  .photo{height:125px}
  .info{padding:9px}
  .price{font-size:12px}
  .side{grid-template-columns:1fr}
  .sectionTitle h2{font-size:18px}
  .footerInner{align-items:flex-start;flex-direction:column}
}
`;

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [notice, setNotice] = useState("");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const searchableText =
        `${product.name} ${product.category} ${product.specs}`.toLowerCase();

      return (
        matchesCategory &&
        searchableText.includes(search.trim().toLowerCase())
      );
    });
  }, [search, category]);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    notify(`${product.name} added to your cart.`);
  }

  function changeQuantity(id, difference) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + difference }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function orderOnWhatsApp() {
    if (cart.length === 0) {
      notify("Your cart is empty. Add a product first.");
      return;
    }

    const items = cart
      .map(
        (item) =>
          `${item.name} x ${item.quantity} — ${money(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const message =
      `Hello MAX Computers and Phones!\n\nI would like to order:\n${items}` +
      `\n\nSubtotal: ${money(total)}` +
      "\nPlease confirm availability and delivery charges.";

    window.open(
      `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="store">
      <style>{styles}</style>

      <header className="header">
        <div className="wrap nav">
          {/* Text brand replaces the broken logo image */}
          <a
            className="brand"
            href="#"
            aria-label="MAX Computers and Phones home"
          >
            <div className="brandName">
              <strong>MAX</strong>
              <span>COMPUTERS &amp; PHONES</span>
            </div>
          </a>

          <nav className="links" aria-label="Main navigation">
            <a href="#">Home</a>
            {["Laptops", "Phones", "Tablets", "Accessories", "Gaming"].map(
              (name) => (
                <a
                  key={name}
                  href="#products"
                  onClick={() => setCategory(name)}
                >
                  {name}
                </a>
              )
            )}
            <a href="#contact">Contact</a>
          </nav>

          <input
            className="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="⌕ Search products..."
            aria-label="Search products"
          />

          <button
            className="cartBtn"
            onClick={() =>
              document.getElementById("cart")?.scrollIntoView({
                behavior: "smooth"
              })
            }
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            🛒 <span className="count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main className="wrap">
        <section
          className="hero"
          aria-label="MAX Computers and Phones banner"
        >
          <img
            className="heroImage"
            src="/max-hero.png"
            alt="MAX Computers and Phones banner"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </section>

        <section
          className="categories"
          aria-label="Product categories"
        >
          {CATEGORIES.map((name, index) => (
            <button
              key={name}
              className={`cat ${category === name ? "active" : ""}`}
              onClick={() => {
                setCategory(name);
                document.getElementById("products")?.scrollIntoView({
                  behavior: "smooth"
                });
              }}
            >
              <span className="catIcon">
                {CATEGORY_ICONS[index]}
              </span>
              {name}
            </button>
          ))}
        </section>

        <div className="layout">
          <section id="products">
            <div className="sectionTitle">
              <div>
                <h2>🔥 Featured Products</h2>
                <div className="sub">
                  Discover technology for work, school, gaming and everyday life.
                </div>
              </div>

              <button
                className="viewAll"
                onClick={() => {
                  setCategory("All");
                  setSearch("");
                }}
              >
                View All →
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty">
                No products found. Try another search or category.
              </div>
            ) : (
              <div className="products">
                {filteredProducts.map((product) => (
                  <article className="product" key={product.id}>
                    <div className="photo">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://placehold.co/600x400/0b2036/ffffff?text=MAX+Computers";
                        }}
                      />
                      <span className="tag">
                        {product.category}
                      </span>
                    </div>

                    <div className="info">
                      <h3>{product.name}</h3>
                      <div className="spec">{product.specs}</div>
                      <div className="stars" aria-label="Decorative rating">
                        ★★★★★
                      </div>
                      <div className="price">
                        {money(product.price)}
                      </div>
                      <div className="stock">
                        ● Confirm stock with us
                      </div>
                      <button
                        className="addBtn"
                        onClick={() => addToCart(product)}
                      >
                        🛒 &nbsp; Add to Cart
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="side">
            <section className="panel" id="cart">
              <h3>
                🛒 Your Cart{" "}
                <span className="count">{cartCount}</span>
              </h3>

              {cart.length === 0 ? (
                <p className="sub">
                  Your cart is empty. Add products to start your order.
                </p>
              ) : (
                cart.map((item) => (
                  <div className="line" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <small>
                        {money(item.price * item.quantity)}
                      </small>
                      <div className="qty">
                        <button
                          onClick={() => changeQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name}`}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="totalRow">
                <span>Subtotal</span>
                <span>{money(total)}</span>
              </div>
              <div className="totalRow">
                <span>Delivery</span>
                <span>Confirm on WhatsApp</span>
              </div>
              <div className="totalRow final">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>

              <button
                className="whatsapp"
                onClick={orderOnWhatsApp}
              >
                Order on WhatsApp
              </button>

              <button
                className="clearBtn"
                onClick={() => {
                  setCart([]);
                  notify("Your cart has been cleared.");
                }}
              >
                Clear Cart
              </button>
            </section>

            <section className="panel" id="contact">
              <h3>♧ Get In Touch</h3>

              <div className="contact">
                Email:
                <br />
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

                <br />
                WhatsApp:
                <br />
                <a
                  href={`https://wa.me/${PHONE}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  +{PHONE}
                </a>

                <br />
                Instagram:
                <br />
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                >
                  @max_computer_250
                </a>
              </div>

              <div className="slogan">
                Your Tech,
                <br />
                Our Priority!
              </div>
            </section>
          </aside>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap footerInner">
          <div>
            <strong>MAX</strong>
            <br />
            COMPUTERS &amp; PHONES
          </div>

          <div>
            Quality Products · Easy Ordering · Customer Support
          </div>

          <div>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer">
              Instagram
            </a>
            {" · "}
            <a
              href={`https://wa.me/${PHONE}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            {" · "}
            <a href={`mailto:${EMAIL}`}>Email</a>
          </div>

          <div>
            © {new Date().getFullYear()} MAX Computers and Phones
          </div>
        </div>
      </footer>

      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}
