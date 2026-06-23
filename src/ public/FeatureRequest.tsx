import { useEffect, useState } from "react";
import {
  getAllInquiries,
  postInquiryConfirm,
  postInquiryRequest,
} from "../api/requests";
import GetFooterSection from "../components/footer";
import GetHeader from "../components/header";
import { FeatureRequestCategory, InquiryModel } from "../api/interfaces";
import MFAConfirmation from "./MFAConfirmation";

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

.nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;padding:18px 48px;
  background:rgba(247,244,239,0.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--card-border);}
.brand{font-family:var(--serif);font-size:1.4rem;font-weight:900;letter-spacing:-0.5px;text-decoration:none;color:var(--ink);}
.brand span{color:var(--accent);}
.nav-links{margin-left:auto;display:flex;gap:30px;}
.nav-links a{font-size:0.82rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--mid);text-decoration:none;transition:color 0.18s;}
.nav-links a:hover{color:var(--accent);}

.wrap{max-width:1180px;margin:0 auto;padding:0 48px;}

.hero{position:relative;overflow:hidden;background:var(--ink);color:var(--cream);padding:80px 0 70px;}
.hero::after{content:'';position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;
  background:radial-gradient(circle,rgba(200,69,42,0.4),transparent 70%);}
.hero-eyebrow{font-size:0.72rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;opacity:0;animation:rise 0.7s 0.05s forwards;}
.hero-title{font-family:var(--serif);font-weight:900;font-size:clamp(2.4rem,6vw,4.2rem);line-height:1.05;letter-spacing:-1.5px;max-width:16ch;opacity:0;animation:rise 0.7s 0.15s forwards;}
.hero-title em{color:var(--accent);font-style:normal;}
.hero-lead{margin-top:22px;max-width:56ch;font-size:1.08rem;color:#cbc6bf;opacity:0;animation:rise 0.7s 0.28s forwards;}
@keyframes rise{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}

section{padding:60px 0;}
.board-layout{display:grid;grid-template-columns:0.85fr 1.15fr;gap:40px;align-items:start;}

/* submit card */
.submit-card{background:#fff;border:1px solid var(--card-border);border-top:4px solid var(--accent);padding:32px;position:sticky;top:90px;}
.submit-card h2{font-family:var(--serif);font-size:1.5rem;font-weight:800;letter-spacing:-0.5px;margin-bottom:6px;}
.submit-card .sub{font-size:0.9rem;color:var(--mid);margin-bottom:24px;}
.f-field{margin-bottom:16px;}
.f-label{display:block;font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--mid);margin-bottom:7px;}
.f-input,.f-select,.f-textarea{width:100%;padding:11px 13px;border:1px solid #ddd;background:var(--cream);font-family:var(--font);font-size:0.9rem;color:var(--ink);outline:none;transition:border-color 0.2s,background 0.2s;}
.f-input:focus,.f-select:focus,.f-textarea:focus{border-color:var(--accent);background:#fff;}
.f-textarea{resize:vertical;min-height:110px;}
.f-submit{display:inline-flex;align-items:center;gap:9px;width:100%;justify-content:center;padding:13px;margin-top:4px;font-family:var(--font);font-size:0.78rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;background:var(--ink);color:var(--cream);border:2px solid var(--ink);cursor:pointer;transition:all 0.2s;}
.f-submit:hover{background:var(--accent);border-color:var(--accent);}

/* board */
.board-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-bottom:22px;}
.board-title{font-family:var(--serif);font-size:1.5rem;font-weight:800;letter-spacing:-0.5px;}
.filters{display:flex;gap:8px;flex-wrap:wrap;}
.filter-btn{padding:7px 15px;font-size:0.72rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;border:1px solid var(--card-border);background:#fff;color:var(--mid);cursor:pointer;transition:all 0.15s;font-family:var(--font);}
.filter-btn:hover{border-color:var(--ink);color:var(--ink);}
.filter-btn.active{background:var(--ink);border-color:var(--ink);color:var(--cream);}

/* request row */
.req{display:flex;gap:18px;background:#fff;border:1px solid var(--card-border);padding:20px 22px;margin-bottom:14px;transition:transform 0.15s,box-shadow 0.15s;}
.req:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.06);}
.vote{flex-shrink:0;width:62px;display:flex;flex-direction:column;align-items:center;gap:3px;border:1px solid var(--card-border);border-radius:8px;padding:10px 0;cursor:pointer;transition:all 0.15s;user-select:none;background:var(--cream);}
.vote:hover{border-color:var(--accent);}
.vote.voted{background:var(--accent);border-color:var(--accent);}
.vote.voted .v-count,.vote.voted .v-arrow{color:#fff;}
.v-arrow{font-size:1rem;color:var(--accent);line-height:1;}
.v-count{font-family:var(--serif);font-size:1.25rem;font-weight:800;color:var(--ink);line-height:1;}
.v-label{font-size:0.55rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--mid);}
.vote.voted .v-label{color:#ffd9cf;}
.req-body{flex:1;min-width:0;}
.req-body h3{font-family:var(--serif);font-size:1.12rem;font-weight:700;margin-bottom:5px;}
.req-body p{font-size:0.9rem;color:var(--mid);margin-bottom:12px;}
.req-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.tag{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:0.65rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;}
.tag.mobile{background:#e6f1fb;color:#0c447c;}
.tag.payments{background:#eaf3de;color:#27500a;}
.tag.seller{background:#faeeda;color:#633806;}
.tag.logistics{background:#f0e6fb;color:#4a2c7c;}
.tag.ui{background:#fcebeb;color:#791f1f;}
.status{display:inline-flex;align-items:center;gap:5px;font-size:0.7rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;}
.status::before{content:'';width:7px;height:7px;border-radius:50%;background:currentColor;}
.status.planned{color:#2980b9;}
.status.progress{color:#e67e22;}
.status.shipped{color:#2d6a4f;}
.status.review{color:#8e44ad;}
.req-author{font-size:0.72rem;color:#aaa;margin-left:auto;}
.req-author i{margin-right:4px;}

/* roadmap legend */
.legend{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:34px;}
.legend-card{background:#fff;border:1px solid var(--card-border);padding:18px;text-align:center;}
.legend-card .num{font-family:var(--serif);font-size:1.8rem;font-weight:800;color:var(--ink);}
.legend-card .num.blue{color:#2980b9;}
.legend-card .num.orange{color:#e67e22;}
.legend-card .num.green{color:#2d6a4f;}
.legend-card .num.purple{color:#8e44ad;}
.legend-card .lbl{font-size:0.66rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--mid);margin-top:4px;}

.foot{padding:34px 48px;text-align:center;font-size:0.78rem;color:var(--mid);border-top:1px solid var(--card-border);}
.foot span{color:var(--accent);}

@media(max-width:991px){
  .wrap,.nav,.foot{padding-left:28px;padding-right:28px;}
  .board-layout{grid-template-columns:1fr;gap:28px;}
  .submit-card{position:static;}
  .legend{grid-template-columns:repeat(2,1fr);}
  .nav-links{display:none;}
}
`;

function FeatureRequestPage() {
  const [inquiries, setInquires] = useState<InquiryModel[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [inquiry, setInquiry] = useState<InquiryModel | null>(null);
  const [mfaCode, setMfaCode] = useState<string>("");
  const [planned, setPlanned] = useState<number>(0);
  const [inProgress, setInProgress] = useState<number>(0);
  const [shipped, setShipped] = useState<number>(0);
  const [underReview, setUnderReview] = useState<number>(0);

  const CATEGORIES: FeatureRequestCategory[] = [
    "VISUAL_DO_WEBSITE",
    "DISPOSITIVOS_MÓVEIS",
    "PAINEL_DE_CONTROLE",
    "PEDIDOS",
    "CARRINHO",
    "ESTOQUE",
    "GESTÃO_DE_EQUIPE",
    "GESTÃO_DE_EMPREGADORES",
    "GESTÃO_DE_USUÁRIOS",
    "AUTENTICAÇÃO",
    "RELATÓRIOS",
    "ANÁLISE_DE_DADOS",
    "NOTIFICAÇÕES",
    "INTEGRAÇÕES",
    "API",
    "SEGURANÇA",
    "DESEMPENHO",
    "AUTOMAÇÃO",
    "FLUXO_DE_TRABALHO",
    "FATURAMENTO",
    "PAGAMENTOS",
    "EXPORTAÇÃO_DE_DADOS",
    "BUSCA",
    "ACESSIBILIDADE",
    "CORREÇÃO_DE_ERROS",
    "OUTRO",
  ];

  const emptyForm: InquiryModel = {
    title: "",
    category: "OUTRO",
    description: "",
    userEmail: "",
    userName: "",
    votes: "0",
    status: "EM_REVISÃO",
  };

  const [form, setForm] = useState<InquiryModel>(emptyForm);

  const set = (k: keyof InquiryModel, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleOpenVerification = () => {
    if (!form.title || !form.description || !form.userEmail || !form.userName) {
      alert("Preencha todos os campos.");
      return;
    }
    setIsModalOpen(true); // modal will send the code via onSendCode
  };

  const handleVerifySuccess = async (code: string) => {
    try {
      // submit the inquiry WITH the verified code.
      // Replace `confirmInquiry` with your real create-inquiry endpoint.
      const response = await postInquiryConfirm(code, form);
      if (response.ok) {
        alert("Pedido enviado com sucesso!");
        setIsModalOpen(false);
        setForm(emptyForm);
        setRefreshTrigger((p) => !p);
      } else {
        alert(await response.text());
      }
    } catch {
      alert("Falha ao enviar o pedido.");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("user@example.com");

  const loadInquiries = async () => {
    try {
      const response = await getAllInquiries();
      console.log("Inquiries", response);
      const data = await response.json();
    } catch (error) {
      alert("There was an issue loading inquiries. Please come back later");
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [refreshTrigger]);

  const handlePostInquiryRequest = async () => {
    try {
      const response = await postInquiryRequest(form.userEmail);

      if (response.status === 202) {
        alert("We have sent you an code for veriication purposes!");
        setRefreshTrigger((prev) => !prev);
        // This forces the useEffect above to fire again
      }
    } catch (error) {
      console.error("Failed to post inquiry", error);
    }
  };

  return (
    <>
      <GetHeader />
      <style>{STYLES}</style>

      <header className="hero">
        <div className="wrap">
          <div className="hero-eyebrow">Feature Requests</div>
          <h1 className="hero-title">
            You build this <em>with us.</em>
          </h1>
          <p className="hero-lead">
            Every feature on our roadmap started as someone's idea. Post yours,
            vote on others, and watch the most-wanted ones get built. We ship
            the things you ask for most.
          </p>
        </div>
      </header>

      <section className="wrap" id="board">
        {/* roadmap legend */}
        <div className="legend">
          <div className="legend-card">
            <div className="num blue">18</div>
            <div className="lbl">Planned</div>
          </div>
          <div className="legend-card">
            <div className="num orange">7</div>
            <div className="lbl">In Progress</div>
          </div>
          <div className="legend-card">
            <div className="num green">42</div>
            <div className="lbl">Shipped</div>
          </div>
          <div className="legend-card">
            <div className="num purple">5</div>
            <div className="lbl">Under Review</div>
          </div>
        </div>

        <div className="board-layout">
          {/* SUBMIT FORM */}
          <div className="submit-card" id="submit">
            <h2>Suggest a feature</h2>
            <p className="sub">
              Got an idea that'd make Meridian better? We read every single one.
            </p>

            <div className="f-field">
              <label className="f-label">Feature title</label>
              <input
                className="f-input"
                type="text"
                placeholder="e.g. Bulk product upload via CSV"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>
            <div className="f-field">
              <label className="f-label">Category</label>
              <select
                className="f-select"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="f-field">
              <label className="f-label">Describe it</label>
              <textarea
                className="f-textarea"
                placeholder="What problem does it solve? Who benefits?"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div className="f-field">
              <label className="f-label">Your email</label>
              <input
                className="f-input"
                type="email"
                placeholder="you@example.com"
                value={form.userEmail}
                onChange={(e) => set("userEmail", e.target.value)}
              />
            </div>
            <div className="f-field">
              <label className="f-label">Your Name</label>
              <input
                className="f-input"
                type="text"
                placeholder="Alex S. Limas"
                value={form.userName}
                onChange={(e) => set("userName", e.target.value)}
              />
            </div>
            <button className="f-submit" onClick={handleOpenVerification}>
              <i className="bi bi-lightbulb"></i> Post Request
            </button>
          </div>

          {/* REQUEST BOARD */}
          <div>
            <div className="board-head">
              <div className="board-title">Community requests</div>
              <div className="filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Planned</button>
                <button className="filter-btn">In Progress</button>
                <button className="filter-btn">Shipped</button>
              </div>
            </div>

            <div>
              <div className="req">
                <div className="vote">
                  <span className="v-arrow">
                    <i className="bi bi-caret-up-fill"></i>
                  </span>
                  <span className="v-count">284</span>
                  <span className="v-label">votes</span>
                </div>
                <div className="req-body">
                  <h3>Offline mode for the seller app</h3>
                  <p>
                    Let vendors add and edit listings without signal, then sync
                    when they're back online. Half our islands have patchy
                    coverage.
                  </p>
                  <div className="req-meta">
                    <span className="tag mobile">Mobile App</span>
                    <span className="status progress">In Progress</span>
                    <span className="req-author">
                      <i className="bi bi-person-circle"></i>Rina K.
                    </span>
                  </div>
                </div>
              </div>

              <div className="req">
                <div className="vote">
                  <span className="v-arrow">
                    <i className="bi bi-caret-up-fill"></i>
                  </span>
                  <span className="v-count">201</span>
                  <span className="v-label">votes</span>
                </div>
                <div className="req-body">
                  <h3>Bulk product upload via CSV</h3>
                  <p>
                    Wholesalers with hundreds of SKUs need to upload a
                    spreadsheet instead of adding items one by one.
                  </p>
                  <div className="req-meta">
                    <span className="tag seller">Seller Tools</span>
                    <span className="status planned">Planned</span>
                    <span className="req-author">
                      <i className="bi bi-person-circle"></i>Dauda O.
                    </span>
                  </div>
                </div>
              </div>

              <div className="req">
                <div className="vote">
                  <span className="v-arrow">
                    <i className="bi bi-caret-up-fill"></i>
                  </span>
                  <span className="v-count">176</span>
                  <span className="v-label">votes</span>
                </div>
                <div className="req-body">
                  <h3>Split payments across multiple cards</h3>
                  <p>
                    Customers want to pay part now, part on delivery, or split a
                    large order between two payment methods.
                  </p>
                  <div className="req-meta">
                    <span className="tag payments">Payments</span>
                    <span className="status planned">Planned</span>
                    <span className="req-author">
                      <i className="bi bi-person-circle"></i>Tomas M.
                    </span>
                  </div>
                </div>
              </div>

              <div className="req">
                <div className="vote">
                  <span className="v-arrow">
                    <i className="bi bi-caret-up-fill"></i>
                  </span>
                  <span className="v-count">143</span>
                  <span className="v-label">votes</span>
                </div>
                <div className="req-body">
                  <h3>Live delivery driver tracking on a map</h3>
                  <p>
                    Show buyers exactly where their courier is between islands,
                    like ride-share apps do.
                  </p>
                  <div className="req-meta">
                    <span className="tag logistics">Logistics</span>
                    <span className="status review">Under Review</span>
                    <span className="req-author">
                      <i className="bi bi-person-circle"></i>Amara V.
                    </span>
                  </div>
                </div>
              </div>

              <div className="req">
                <div className="vote">
                  <span className="v-arrow">
                    <i className="bi bi-caret-up-fill"></i>
                  </span>
                  <span className="v-count">119</span>
                  <span className="v-label">votes</span>
                </div>
                <div className="req-body">
                  <h3>Dark mode for the dashboard</h3>
                  <p>
                    Sellers working late nights want an easier-on-the-eyes theme
                    across the whole admin panel.
                  </p>
                  <div className="req-meta">
                    <span className="tag ui">UI / Design</span>
                    <span className="status progress">In Progress</span>
                    <span className="req-author">
                      <i className="bi bi-person-circle"></i>Leah F.
                    </span>
                  </div>
                </div>
              </div>

              <div className="req">
                <div className="vote">
                  <span className="v-arrow">
                    <i className="bi bi-caret-up-fill"></i>
                  </span>
                  <span className="v-count">312</span>
                  <span className="v-label">votes</span>
                </div>
                <div className="req-body">
                  <h3>Saturday delivery slots</h3>
                  <p>
                    Weekend delivery was the #1 ask for two years running. Now
                    live across all six logistics hubs.
                  </p>
                  <div className="req-meta">
                    <span className="tag logistics">Logistics</span>
                    <span className="status shipped">Shipped</span>
                    <span className="req-author">
                      <i className="bi bi-person-circle"></i>Community
                    </span>
                  </div>
                </div>
              </div>

              <div className="req">
                <div className="vote">
                  <span className="v-arrow">
                    <i className="bi bi-caret-up-fill"></i>
                  </span>
                  <span className="v-count">227</span>
                  <span className="v-label">votes</span>
                </div>
                <div className="req-body">
                  <h3>Multi-language product listings</h3>
                  <p>
                    Sellers can now publish listings in three languages at once,
                    auto-shown by buyer preference.
                  </p>
                  <div className="req-meta">
                    <span className="tag seller">Seller Tools</span>
                    <span className="status shipped">Shipped</span>
                    <span className="req-author">
                      <i className="bi bi-person-circle"></i>Community
                    </span>
                  </div>
                </div>
              </div>

              <div className="req">
                <div className="vote">
                  <span className="v-arrow">
                    <i className="bi bi-caret-up-fill"></i>
                  </span>
                  <span className="v-count">88</span>
                  <span className="v-label">votes</span>
                </div>
                <div className="req-body">
                  <h3>Wishlist sharing with friends</h3>
                  <p>
                    Let buyers send a wishlist link so others can buy items for
                    birthdays and holidays.
                  </p>
                  <div className="req-meta">
                    <span className="tag mobile">Mobile App</span>
                    <span className="status planned">Planned</span>
                    <span className="req-author">
                      <i className="bi bi-person-circle"></i>Priya N.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GetFooterSection />
      <MFAConfirmation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVerifySuccess={handleVerifySuccess}
        inquiry={form}
      />
    </>
  );
}

export default FeatureRequestPage;
