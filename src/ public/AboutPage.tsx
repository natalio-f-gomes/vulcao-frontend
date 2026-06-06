const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css');

:root{
  --ink:#0f0e0e;
  --cream:#f7f4ef;
  --accent:#c8452a;
  --mid:#5a5650;
  --card-border:#e8e4de;
  --font:'DM Sans',system-ui,sans-serif;
  --serif:'Playfair Display',serif;
  --radius:8px;
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  background:var(--cream);
  color:var(--ink);
  font-family:var(--font);
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
/* ---------- decorative grain / texture ---------- */
body::before{
  content:'';
  position:fixed;inset:0;
  pointer-events:none;z-index:9999;
  opacity:0.025;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* ---------- top nav ---------- */
.nav{
  position:sticky;top:0;z-index:100;
  display:flex;align-items:center;
  padding:18px 48px;
  background:rgba(247,244,239,0.85);
  backdrop-filter:blur(10px);
  border-bottom:1px solid var(--card-border);
}
.brand{
  font-family:var(--serif);
  font-size:1.4rem;font-weight:900;
  letter-spacing:-0.5px;text-decoration:none;color:var(--ink);
}
.brand span{color:var(--accent);}
.nav-links{margin-left:auto;display:flex;gap:30px;}
.nav-links a{
  font-size:0.82rem;font-weight:600;letter-spacing:0.04em;
  text-transform:uppercase;color:var(--mid);text-decoration:none;
  transition:color 0.18s;
}
.nav-links a:hover{color:var(--accent);}
/* ---------- shell ---------- */
.wrap{max-width:1180px;margin:0 auto;padding:0 48px;}
/* ---------- hero ---------- */
.hero{
  position:relative;overflow:hidden;
  background:var(--ink);color:var(--cream);
  padding:90px 0 80px;
}
.hero::after{
  content:'';position:absolute;right:-120px;top:-120px;
  width:420px;height:420px;border-radius:50%;
  background:radial-gradient(circle,rgba(200,69,42,0.4),transparent 70%);
}
.hero-eyebrow{
  font-size:0.72rem;font-weight:700;letter-spacing:0.22em;
  text-transform:uppercase;color:var(--accent);margin-bottom:18px;
  opacity:0;animation:rise 0.7s 0.05s forwards;
}
.hero-title{
  font-family:var(--serif);font-weight:900;
  font-size:clamp(2.6rem,6vw,4.6rem);line-height:1.05;
  letter-spacing:-1.5px;max-width:14ch;
  opacity:0;animation:rise 0.7s 0.15s forwards;
}
.hero-title em{color:var(--accent);font-style:normal;}
.hero-lead{
  margin-top:26px;max-width:52ch;
  font-size:1.1rem;color:#cbc6bf;font-weight:400;
  opacity:0;animation:rise 0.7s 0.28s forwards;
}
@keyframes rise{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
/* ---------- stat strip ---------- */
.stat-strip{
  display:grid;grid-template-columns:repeat(4,1fr);
  border:1px solid var(--card-border);background:#fff;
  margin-top:-46px;position:relative;z-index:5;
  box-shadow:0 12px 40px rgba(0,0,0,0.08);
}
.stat{padding:30px 26px;border-right:1px solid var(--card-border);}
.stat:last-child{border-right:none;}
.stat-num{
  font-family:var(--serif);font-size:2.3rem;font-weight:800;
  letter-spacing:-1px;color:var(--ink);
}
.stat-num span{color:var(--accent);}
.stat-label{
  font-size:0.7rem;font-weight:600;letter-spacing:0.1em;
  text-transform:uppercase;color:var(--mid);margin-top:6px;
}
/* ---------- section scaffolding ---------- */
section{padding:74px 0;}
.section-eyebrow{
  font-size:0.7rem;font-weight:700;letter-spacing:0.18em;
  text-transform:uppercase;color:var(--accent);margin-bottom:10px;
}
.section-title{
  font-family:var(--serif);font-weight:800;
  font-size:clamp(1.9rem,4vw,2.7rem);letter-spacing:-0.8px;
  max-width:20ch;line-height:1.1;
}
.section-intro{
  max-width:60ch;margin-top:18px;color:var(--mid);font-size:1.02rem;
}
/* ---------- story / two-column ---------- */
.story{display:grid;grid-template-columns:1fr 1fr;gap:54px;align-items:center;}
.story-text p{margin-bottom:16px;color:var(--mid);}
.story-text p:first-of-type{
  font-size:1.15rem;color:var(--ink);font-weight:500;
}
.story-card{
  background:var(--ink);color:var(--cream);padding:40px;
  border-top:4px solid var(--accent);position:relative;
}
.story-card .quote-mark{
  font-family:var(--serif);font-size:5rem;line-height:0.6;
  color:var(--accent);opacity:0.4;display:block;
}
.story-card blockquote{
  font-family:var(--serif);font-size:1.35rem;font-style:italic;
  line-height:1.4;margin:14px 0 24px;
}
.story-card cite{
  font-style:normal;font-size:0.82rem;font-weight:600;
  letter-spacing:0.05em;color:#cbc6bf;
}
.story-card cite b{color:var(--cream);display:block;font-size:0.92rem;}
/* ---------- values grid ---------- */
.values-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px;
}
.value-card{
  background:#fff;border:1px solid var(--card-border);
  padding:30px 28px;transition:transform 0.2s,box-shadow 0.2s;
}
.value-card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(0,0,0,0.07);}
.value-icon{
  width:46px;height:46px;border-radius:50%;
  background:var(--cream);border:1px solid var(--card-border);
  display:flex;align-items:center;justify-content:center;
  color:var(--accent);font-size:1.2rem;margin-bottom:18px;
}
.value-card h3{
  font-family:var(--serif);font-size:1.2rem;font-weight:700;margin-bottom:8px;
}
.value-card p{font-size:0.92rem;color:var(--mid);}
/* ---------- timeline ---------- */
.timeline{position:relative;margin-top:44px;padding-left:34px;}
.timeline::before{
  content:'';position:absolute;left:7px;top:6px;bottom:6px;
  width:2px;background:var(--card-border);
}
.tl-item{position:relative;padding-bottom:34px;}
.tl-item:last-child{padding-bottom:0;}
.tl-item::before{
  content:'';position:absolute;left:-34px;top:4px;
  width:16px;height:16px;border-radius:50%;
  background:var(--cream);border:3px solid var(--accent);
}
.tl-year{
  font-family:'DM Mono',monospace;font-size:0.78rem;font-weight:500;
  color:var(--accent);letter-spacing:0.06em;
}
.tl-item h4{font-family:var(--serif);font-size:1.15rem;font-weight:700;margin:4px 0 6px;}
.tl-item p{font-size:0.92rem;color:var(--mid);max-width:56ch;}
/* ---------- team ---------- */
.team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:40px;}
.member{
  background:#fff;border:1px solid var(--card-border);overflow:hidden;
  transition:transform 0.2s,box-shadow 0.2s;
}
.member:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(0,0,0,0.07);}
.member-banner{
  height:90px;background:linear-gradient(135deg,var(--ink),#2a2622);
  display:flex;align-items:flex-end;justify-content:center;
}
.member-avatar{
  width:72px;height:72px;border-radius:50%;
  background:var(--cream);border:3px solid #fff;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--serif);font-weight:800;font-size:1.5rem;color:var(--accent);
  margin-bottom:-36px;box-shadow:0 4px 12px rgba(0,0,0,0.15);
}
.member-body{padding:48px 22px 24px;text-align:center;}
.member-name{font-family:var(--serif);font-size:1.12rem;font-weight:700;}
.member-role{
  font-size:0.7rem;font-weight:600;letter-spacing:0.08em;
  text-transform:uppercase;color:var(--accent);margin-top:3px;
}
.member-bio{font-size:0.85rem;color:var(--mid);margin-top:12px;}
.member-socials{display:flex;justify-content:center;gap:14px;margin-top:16px;}
.member-socials a{color:var(--mid);font-size:1rem;transition:color 0.15s;}
.member-socials a:hover{color:var(--accent);}
/* ---------- cta ---------- */
.cta{
  background:var(--ink);color:var(--cream);
  text-align:center;padding:80px 48px;position:relative;overflow:hidden;
}
.cta::before{
  content:'';position:absolute;left:50%;top:-80px;transform:translateX(-50%);
  width:480px;height:300px;
  background:radial-gradient(ellipse,rgba(200,69,42,0.3),transparent 70%);
}
.cta h2{
  font-family:var(--serif);font-weight:800;
  font-size:clamp(2rem,4vw,3rem);letter-spacing:-1px;position:relative;
}
.cta p{margin:16px auto 0;max-width:46ch;color:#cbc6bf;position:relative;}
.cta-btns{display:flex;gap:14px;justify-content:center;margin-top:32px;position:relative;}
.btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:14px 30px;font-size:0.82rem;font-weight:600;
  letter-spacing:0.06em;text-transform:uppercase;
  cursor:pointer;text-decoration:none;border:2px solid;transition:all 0.2s;
}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff;}
.btn.primary:hover{background:transparent;color:var(--accent);}
.btn.ghost{background:transparent;border-color:#444;color:var(--cream);}
.btn.ghost:hover{border-color:var(--cream);}
/* ---------- footer ---------- */
.foot{padding:34px 48px;text-align:center;font-size:0.78rem;color:var(--mid);border-top:1px solid var(--card-border);}
.foot span{color:var(--accent);}
/* ---------- responsive ---------- */
@media(max-width:991px){
  .wrap,.nav,.cta,.foot{padding-left:28px;padding-right:28px;}
  .stat-strip{grid-template-columns:repeat(2,1fr);}
  .stat:nth-child(2){border-right:none;}
  .story{grid-template-columns:1fr;gap:34px;}
  .values-grid{grid-template-columns:1fr;}
  .team-grid{grid-template-columns:repeat(2,1fr);}
  .nav-links{display:none;}
}
@media(max-width:560px){
  .stat-strip{grid-template-columns:1fr;}
  .stat{border-right:none;border-bottom:1px solid var(--card-border);}
  .team-grid{grid-template-columns:1fr;}
}
`;

function AboutPage() {
  return (
    <>
      <style>{STYLES}</style>

      <nav className="nav">
        <a href="#" className="brand">Meridian<span>.</span></a>
        <div className="nav-links">
          <a href="#story">Story</a>
          <a href="#values">Values</a>
          <a href="#journey">Journey</a>
          <a href="#team">Team</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="wrap">
          <div className="hero-eyebrow">About Meridian Marketplace</div>
          <h1 className="hero-title">We connect island makers with <em>the world.</em></h1>
          <p className="hero-lead">Founded in 2014 on the back of a single fish market stall, Meridian has grown into the archipelago's largest commerce platform — built by locals, for locals, and shipped everywhere.</p>
        </div>
      </header>

      {/* STAT STRIP */}
      <div className="wrap">
        <div className="stat-strip">
          <div className="stat"><div className="stat-num">12<span>k+</span></div><div className="stat-label">Registered Businesses</div></div>
          <div className="stat"><div className="stat-num">$48<span>M</span></div><div className="stat-label">Annual GMV</div></div>
          <div className="stat"><div className="stat-num">340<span>k</span></div><div className="stat-label">Active Customers</div></div>
          <div className="stat"><div className="stat-num">26</div><div className="stat-label">Islands Served</div></div>
        </div>
      </div>

      {/* STORY */}
      <section id="story" className="wrap">
        <div className="story">
          <div className="story-text">
            <div className="section-eyebrow">Our Story</div>
            <h2 className="section-title">From a harbour stall to a household name.</h2>
            <p>It started with mangoes that wouldn't sell. Our founder, Amara Velasquez, watched her family's produce rot at the dock while buyers two islands over went without. There had to be a better way to close that gap.</p>
            <p>The first version of Meridian was a spreadsheet and a borrowed delivery van. Within a year it was a real platform — letting any vendor, from a one-person bakery to a regional wholesaler, list their goods and reach customers across the water.</p>
            <p>A decade later, we're still obsessed with that original problem: making sure good things made here can find the people who want them, wherever they are.</p>
          </div>
          <div className="story-card">
            <span className="quote-mark">&ldquo;</span>
            <blockquote>We never wanted to replace the local shop. We wanted to give it a bigger doorway.</blockquote>
            <cite><b>Amara Velasquez</b>Founder &amp; CEO</cite>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section id="values" className="wrap">
        <div className="section-eyebrow">What We Stand For</div>
        <h2 className="section-title">Four principles we refuse to compromise on.</h2>
        <p className="section-intro">They're not posters on a wall — they're how we decide what to build, who to hire, and which shortcuts we'll never take.</p>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon"><i className="bi bi-people-fill"></i></div>
            <h3>Local First</h3>
            <p>Every feature is judged by one question: does it help an island business sell more of what they make? If not, it waits.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="bi bi-shield-check"></i></div>
            <h3>Earned Trust</h3>
            <p>We hold seller and buyer funds like they're our own, with transparent fees and zero hidden charges. Trust is slow to build and fast to lose.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="bi bi-lightning-charge-fill"></i></div>
            <h3>Move with Care</h3>
            <p>We'd rather ship something solid on Friday than something fragile on Tuesday. Speed matters, but not at the cost of the people relying on us.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="bi bi-globe2"></i></div>
            <h3>Open Horizons</h3>
            <p>A vendor in a village of 200 deserves the same reach as one in the capital. We close distance, not widen it.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="bi bi-recycle"></i></div>
            <h3>Leave It Better</h3>
            <p>Carbon-aware routing, reusable packaging partners, and a reforestation pledge on every thousandth order. The islands gave us everything.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="bi bi-chat-heart-fill"></i></div>
            <h3>Real Humans</h3>
            <p>Support answered by people who know the difference between Windward and Leeward. No phone trees, no scripted dead-ends.</p>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="journey" className="wrap">
        <div className="section-eyebrow">The Journey</div>
        <h2 className="section-title">Ten years, a few hundred wrong turns.</h2>
        <div className="timeline">
          <div className="tl-item">
            <div className="tl-year">2014</div>
            <h4>The Spreadsheet Era</h4>
            <p>Amara lists 14 vendors from the Port Harbour market. First cross-island delivery takes nine hours and a very patient cousin with a boat.</p>
          </div>
          <div className="tl-item">
            <div className="tl-year">2016</div>
            <h4>Meridian Goes Live</h4>
            <p>The first real web platform launches with 400 sellers. We crash on day one from too much traffic — a problem we were thrilled to have.</p>
          </div>
          <div className="tl-item">
            <div className="tl-year">2019</div>
            <h4>The Logistics Network</h4>
            <p>We open our own consolidation hubs on six islands, cutting average delivery from four days to under 36 hours.</p>
          </div>
          <div className="tl-item">
            <div className="tl-year">2022</div>
            <h4>Crossing the Water</h4>
            <p>International shipping launches. A weaver in a coastal village ships her first order to a buyer 4,000 miles away.</p>
          </div>
          <div className="tl-item">
            <div className="tl-year">2025</div>
            <h4>Twelve Thousand Strong</h4>
            <p>Meridian crosses 12,000 registered businesses and $48M in annual sales — still run from the same harbour town where it began.</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="wrap">
        <div className="section-eyebrow">The People</div>
        <h2 className="section-title">Small team, stubborn standards.</h2>
        <p className="section-intro">We're forty-one people across four islands. Here are a few of the faces who keep the lights on.</p>
        <div className="team-grid">
          <div className="member">
            <div className="member-banner"><div className="member-avatar">AV</div></div>
            <div className="member-body">
              <div className="member-name">Amara Velasquez</div>
              <div className="member-role">Founder &amp; CEO</div>
              <p className="member-bio">Started it all with a stall and a stubborn idea. Still answers support tickets on weekends.</p>
              <div className="member-socials"><a href="#"><i className="bi bi-linkedin"></i></a><a href="#"><i className="bi bi-twitter-x"></i></a></div>
            </div>
          </div>
          <div className="member">
            <div className="member-banner"><div className="member-avatar">DO</div></div>
            <div className="member-body">
              <div className="member-name">Dauda Okonkwo</div>
              <div className="member-role">Head of Engineering</div>
              <p className="member-bio">Keeps the platform standing during festival-season traffic spikes. Former bridge engineer.</p>
              <div className="member-socials"><a href="#"><i className="bi bi-linkedin"></i></a><a href="#"><i className="bi bi-github"></i></a></div>
            </div>
          </div>
          <div className="member">
            <div className="member-banner"><div className="member-avatar">RK</div></div>
            <div className="member-body">
              <div className="member-name">Rina Kalouri</div>
              <div className="member-role">Head of Seller Success</div>
              <p className="member-bio">Has personally onboarded over 2,000 vendors. Knows every market by name.</p>
              <div className="member-socials"><a href="#"><i className="bi bi-linkedin"></i></a><a href="#"><i className="bi bi-twitter-x"></i></a></div>
            </div>
          </div>
          <div className="member">
            <div className="member-banner"><div className="member-avatar">TM</div></div>
            <div className="member-body">
              <div className="member-name">Tomas Mwangi</div>
              <div className="member-role">Head of Logistics</div>
              <p className="member-bio">Turned a borrowed van into a six-island delivery network. Sleeps with a tide chart.</p>
              <div className="member-socials"><a href="#"><i className="bi bi-linkedin"></i></a><a href="#"><i className="bi bi-github"></i></a></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Got something worth selling?</h2>
        <p>Join twelve thousand island businesses already reaching customers across the water and beyond.</p>
        <div className="cta-btns">
          <a href="#" className="btn primary"><i className="bi bi-shop"></i> Start Selling</a>
          <a href="#" className="btn ghost"><i className="bi bi-envelope"></i> Talk to Us</a>
        </div>
      </section>

      <footer className="foot">
        &copy; 2025 Meridian Marketplace &nbsp;·&nbsp; Built on the islands<span>.</span> &nbsp;·&nbsp; Port Harbour HQ
      </footer>
    </>
  );
}

export default AboutPage;