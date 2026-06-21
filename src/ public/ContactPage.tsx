const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css');

:root{
  --ink:#0f0e0e;--cream:#f7f4ef;--accent:#c8452a;--mid:#5a5650;
  --card-border:#e8e4de;--font:'DM Sans',system-ui,sans-serif;--serif:'Playfair Display',serif;
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--cream);color:var(--ink);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased;}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.025;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

/* nav */
.nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;padding:18px 48px;
  background:rgba(247,244,239,0.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--card-border);}
.brand{font-family:var(--serif);font-size:1.4rem;font-weight:900;letter-spacing:-0.5px;text-decoration:none;color:var(--ink);}
.brand span{color:var(--accent);}
.nav-links{margin-left:auto;display:flex;gap:30px;}
.nav-links a{font-size:0.82rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--mid);text-decoration:none;transition:color 0.18s;}
.nav-links a:hover{color:var(--accent);}

.wrap{max-width:1180px;margin:0 auto;padding:0 48px;}

/* hero */
.hero{position:relative;overflow:hidden;background:var(--ink);color:var(--cream);padding:80px 0 70px;}
.hero::after{content:'';position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;
  background:radial-gradient(circle,rgba(200,69,42,0.4),transparent 70%);}
.hero-eyebrow{font-size:0.72rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;opacity:0;animation:rise 0.7s 0.05s forwards;}
.hero-title{font-family:var(--serif);font-weight:900;font-size:clamp(2.4rem,6vw,4.2rem);line-height:1.05;letter-spacing:-1.5px;max-width:16ch;opacity:0;animation:rise 0.7s 0.15s forwards;}
.hero-title em{color:var(--accent);font-style:normal;}
.hero-lead{margin-top:22px;max-width:54ch;font-size:1.08rem;color:#cbc6bf;opacity:0;animation:rise 0.7s 0.28s forwards;}
@keyframes rise{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}

/* layout */
section{padding:70px 0;}
.contact-grid{display:grid;grid-template-columns:1.15fr 0.85fr;gap:48px;align-items:start;}

/* form card */
.form-card{background:#fff;border:1px solid var(--card-border);border-top:4px solid var(--accent);padding:36px;}
.form-card h2{font-family:var(--serif);font-size:1.6rem;font-weight:800;letter-spacing:-0.5px;margin-bottom:6px;}
.form-card .sub{font-size:0.92rem;color:var(--mid);margin-bottom:26px;}
.f-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.f-field{margin-bottom:18px;}
.f-label{display:block;font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--mid);margin-bottom:7px;}
.f-input,.f-select,.f-textarea{width:100%;padding:12px 14px;border:1px solid #ddd;background:var(--cream);font-family:var(--font);font-size:0.92rem;color:var(--ink);outline:none;transition:border-color 0.2s,background 0.2s;}
.f-input:focus,.f-select:focus,.f-textarea:focus{border-color:var(--accent);background:#fff;}
.f-textarea{resize:vertical;min-height:130px;}
.f-submit{display:inline-flex;align-items:center;gap:9px;padding:14px 32px;margin-top:6px;font-family:var(--font);font-size:0.8rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;background:var(--ink);color:var(--cream);border:2px solid var(--ink);cursor:pointer;transition:all 0.2s;}
.f-submit:hover{background:var(--accent);border-color:var(--accent);}
.form-note{font-size:0.78rem;color:var(--mid);margin-top:16px;}
.form-note i{color:var(--accent);}

/* info column */
.info-card{background:#fff;border:1px solid var(--card-border);padding:26px;margin-bottom:18px;}
.info-card h3{font-family:var(--serif);font-size:1.05rem;font-weight:700;margin-bottom:18px;}
.info-line{display:flex;gap:14px;align-items:flex-start;padding:12px 0;border-bottom:1px solid #f0ece6;}
.info-line:last-child{border-bottom:none;}
.info-ic{width:38px;height:38px;border-radius:50%;background:var(--cream);border:1px solid var(--card-border);display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:1rem;flex-shrink:0;}
.info-line .lbl{font-size:0.66rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--mid);}
.info-line .val{font-size:0.92rem;font-weight:500;color:var(--ink);margin-top:2px;}
.info-line .val a{color:var(--ink);text-decoration:none;}
.info-line .val a:hover{color:var(--accent);}

/* hours card (dark) */
.hours-card{background:var(--ink);color:var(--cream);padding:26px;border-top:4px solid var(--accent);}
.hours-card h3{font-family:var(--serif);font-size:1.05rem;font-weight:700;margin-bottom:16px;}
.hours-row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #1f1c1a;font-size:0.88rem;}
.hours-row:last-child{border-bottom:none;}
.hours-row span:first-child{color:#cbc6bf;}
.hours-row .open{color:#7fd4a8;font-weight:600;}
.hours-row .closed{color:#d98a7a;font-weight:600;}

/* offices */
.offices{margin-top:10px;}
.section-eyebrow{font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;}
.section-title{font-family:var(--serif);font-weight:800;font-size:clamp(1.8rem,4vw,2.5rem);letter-spacing:-0.8px;}
.office-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px;}
.office{background:#fff;border:1px solid var(--card-border);overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;}
.office:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(0,0,0,0.07);}
.office-banner{height:54px;background:linear-gradient(135deg,var(--ink),#2a2622);display:flex;align-items:center;padding:0 22px;}
.office-banner .pin{color:var(--accent);font-size:1.1rem;margin-right:8px;}
.office-banner .city{font-family:var(--serif);color:var(--cream);font-weight:700;font-size:1.05rem;}
.office-body{padding:20px 22px;}
.office-body .role{font-size:0.66rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--accent);margin-bottom:8px;}
.office-body p{font-size:0.88rem;color:var(--mid);}
.office-body .ph{font-family:'DM Mono',monospace;font-size:0.84rem;color:var(--ink);margin-top:8px;}

/* faq mini */
.faq{margin-top:10px;}
.faq-item{background:#fff;border:1px solid var(--card-border);padding:20px 24px;margin-bottom:12px;}
.faq-item h4{font-family:var(--serif);font-size:1.05rem;font-weight:700;margin-bottom:6px;}
.faq-item h4 i{color:var(--accent);margin-right:8px;}
.faq-item p{font-size:0.9rem;color:var(--mid);}

/* footer */
.foot{padding:34px 48px;text-align:center;font-size:0.78rem;color:var(--mid);border-top:1px solid var(--card-border);}
.foot span{color:var(--accent);}

@media(max-width:991px){
  .wrap,.nav,.foot{padding-left:28px;padding-right:28px;}
  .contact-grid{grid-template-columns:1fr;gap:30px;}
  .office-grid{grid-template-columns:1fr;}
  .nav-links{display:none;}
}
@media(max-width:560px){.f-row{grid-template-columns:1fr;}.form-card{padding:26px 22px;}}
`;

function ContactPage() {
  return (
    <>
      <style>{STYLES}</style>

      <nav className="nav">
        <a href="#" className="brand">
          Meridian<span>.</span>
        </a>
        <div className="nav-links">
          <a href="#">About</a>
          <a href="#form">Get in Touch</a>
          <a href="#offices">Offices</a>
          <a href="#">Request a Feature</a>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <div className="hero-eyebrow">Contact Meridian</div>
          <h1 className="hero-title">
            Let's start a <em>conversation.</em>
          </h1>
          <p className="hero-lead">
            Whether you're a seller with a question, a customer chasing an
            order, or a journalist on deadline — there's a real person on the
            other end. Most messages get a reply within one business day.
          </p>
        </div>
      </header>

      <section className="wrap" id="form">
        <div className="contact-grid">
          {/* FORM */}
          <div className="form-card">
            <h2>Send us a message</h2>
            <p className="sub">
              Fill out the form and the right team will get back to you. No
              bots, no phone trees.
            </p>

            <div className="f-row">
              <div className="f-field">
                <label className="f-label">First Name</label>
                <input className="f-input" type="text" placeholder="Amara" />
              </div>
              <div className="f-field">
                <label className="f-label">Last Name</label>
                <input
                  className="f-input"
                  type="text"
                  placeholder="Velasquez"
                />
              </div>
            </div>

            <div className="f-row">
              <div className="f-field">
                <label className="f-label">Email Address</label>
                <input
                  className="f-input"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="f-field">
                <label className="f-label">Phone (optional)</label>
                <input className="f-input" type="tel" placeholder="954 0142" />
              </div>
            </div>

            <div className="f-field">
              <label className="f-label">I am a…</label>
              <select
                className="f-select"
                defaultValue="Seller / Business owner"
              >
                <option>Seller / Business owner</option>
                <option>Customer / Buyer</option>
                <option>Logistics partner</option>
                <option>Press / Media</option>
                <option>Just curious</option>
              </select>
            </div>

            <div className="f-field">
              <label className="f-label">Subject</label>
              <input
                className="f-input"
                type="text"
                placeholder="What's this about?"
              />
            </div>

            <div className="f-field">
              <label className="f-label">Message</label>
              <textarea
                className="f-textarea"
                placeholder="Tell us what's on your mind…"
              />
            </div>

            <button className="f-submit">
              <i className="bi bi-send"></i> Send Message
            </button>
            <p className="form-note">
              <i className="bi bi-shield-check"></i> We'll never share your
              details. Read our privacy promise.
            </p>
          </div>

          {/* INFO COLUMN */}
          <div>
            <div className="info-card">
              <h3>Reach us directly</h3>
              <div className="info-line">
                <div className="info-ic">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <div className="lbl">General</div>
                  <div className="val">
                    <a href="#">hello@meridian.example</a>
                  </div>
                </div>
              </div>
              <div className="info-line">
                <div className="info-ic">
                  <i className="bi bi-headset"></i>
                </div>
                <div>
                  <div className="lbl">Seller Support</div>
                  <div className="val">
                    <a href="#">sellers@meridian.example</a>
                  </div>
                </div>
              </div>
              <div className="info-line">
                <div className="info-ic">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div>
                  <div className="lbl">Phone</div>
                  <div className="val">+1 (555) 0142-8800</div>
                </div>
              </div>
              <div className="info-line">
                <div className="info-ic">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <div className="lbl">HQ</div>
                  <div className="val">17 Harbour Row, Port Harbour</div>
                </div>
              </div>
            </div>

            <div className="hours-card">
              <h3>Support hours</h3>
              <div className="hours-row">
                <span>Mon – Fri</span>
                <span className="open">07:00 – 20:00</span>
              </div>
              <div className="hours-row">
                <span>Saturday</span>
                <span className="open">09:00 – 17:00</span>
              </div>
              <div className="hours-row">
                <span>Sunday</span>
                <span className="closed">Closed</span>
              </div>
              <div className="hours-row">
                <span>Public holidays</span>
                <span className="closed">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICES */}
      <section className="wrap offices" id="offices">
        <div className="section-eyebrow">Find Us</div>
        <h2 className="section-title">Three islands, one team.</h2>
        <div className="office-grid">
          <div className="office">
            <div className="office-banner">
              <span className="pin">
                <i className="bi bi-geo-alt-fill"></i>
              </span>
              <span className="city">Port Harbour</span>
            </div>
            <div className="office-body">
              <div className="role">Headquarters</div>
              <p>
                17 Harbour Row, Windward District. Where it all started — above
                the old fish market.
              </p>
              <div className="ph">+1 555 0142-8800</div>
            </div>
          </div>
          <div className="office">
            <div className="office-banner">
              <span className="pin">
                <i className="bi bi-geo-alt-fill"></i>
              </span>
              <span className="city">Saltmere</span>
            </div>
            <div className="office-body">
              <div className="role">Logistics Hub</div>
              <p>
                Unit 9, Coastal Trade Park. Our largest consolidation and
                dispatch centre.
              </p>
              <div className="ph">+1 555 0142-8810</div>
            </div>
          </div>
          <div className="office">
            <div className="office-banner">
              <span className="pin">
                <i className="bi bi-geo-alt-fill"></i>
              </span>
              <span className="city">Velha Costa</span>
            </div>
            <div className="office-body">
              <div className="role">Seller Studio</div>
              <p>
                2nd Floor, Mercado Velho. Walk-in onboarding and photography for
                new vendors.
              </p>
              <div className="ph">+1 555 0142-8820</div>
            </div>
          </div>
        </div>
      </section>

      {/* MINI FAQ */}
      <section className="wrap faq">
        <div className="section-eyebrow">Before You Write</div>
        <h2 className="section-title">Quick answers.</h2>
        <div style={{ marginTop: 32 }}>
          <div className="faq-item">
            <h4>
              <i className="bi bi-box-seam"></i>Where's my order?
            </h4>
            <p>
              Track any order live from your dashboard under Orders → Track.
              Support can only see what the tracking shows, so checking there
              first is usually faster.
            </p>
          </div>
          <div className="faq-item">
            <h4>
              <i className="bi bi-shop"></i>How do I start selling?
            </h4>
            <p>
              Hit "Start Selling" on the homepage, or walk into our Velha Costa
              studio. Onboarding takes about 20 minutes and your first listing
              can go live the same day.
            </p>
          </div>
          <div className="faq-item">
            <h4>
              <i className="bi bi-cash-coin"></i>When do sellers get paid?
            </h4>
            <p>
              Payouts clear every Tuesday and Friday for all orders marked
              delivered, minus the flat platform fee. No surprises, no held
              funds.
            </p>
          </div>
        </div>
      </section>

      <footer className="foot">
        &copy; 2025 Meridian Marketplace &nbsp;·&nbsp; Built on the islands
        <span>.</span> &nbsp;·&nbsp; Port Harbour HQ
      </footer>
    </>
  );
}

export default ContactPage;
