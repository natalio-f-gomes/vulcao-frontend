import { useNavigate } from "react-router-dom";
import GetHeader from "../Components/GetHeader";
import { COMPANY_NAME } from "../Interfaces/global";
import GetFooterSection from "../Components/GetFooter";

const creatorName = "Natalio Gomes";

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

/* ---------- hero layout: text + animated logo ---------- */
.hero-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:0; /* Remove gap so logo fills the entire right side */
  align-items:center;
  position:relative;
  z-index:2;
  min-height:400px;
}


/* Text stays on the left */
.hero-copy{
  text-align:left;
  padding-right:48px;
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
  letter-spacing:-1.5px;max-width:16ch;
  opacity:0;animation:rise 0.7s 0.15s forwards;
}
.hero-title em{color:var(--accent);font-style:normal;}
.hero-lead{
  margin-top:26px;max-width:54ch;
  font-size:1.1rem;color:#cbc6bf;font-weight:400;
  opacity:0;animation:rise 0.7s 0.28s forwards;
}
@keyframes rise{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
/* ---------- stat strip ---------- */
.stat-strip{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  border:1px solid var(--card-border);
  background:#fff;
  margin-top:-46px;
  position:relative;
  z-index:5;
  box-shadow:0 12px 40px rgba(0,0,0,0.08);
}
.stat{
  padding:30px 26px;
  border-right:1px solid var(--card-border);
}
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
  max-width:22ch;line-height:1.1;
}
.section-intro{
  max-width:60ch;margin-top:18px;color:var(--mid);font-size:1.02rem;
}
/* ---------- story / two-column ---------- */
.story{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:54px;
  align-items:center;
}
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
/* ---------- values / features grid ---------- */
.values-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:20px;
  margin-top:40px;
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
/* ---------- creator ---------- */
.creator-wrap{max-width:340px;margin:40px auto 0;}
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
.cta p{margin:16px auto 0;max-width:48ch;color:#cbc6bf;position:relative;}
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

/* ============================================ */
/* RESPONSIVE FIXES */
/* ============================================ */

/* MEDIUM SCREENS (tablets) */
@media(max-width:991px){
  .wrap,.nav,.cta,.foot{padding-left:28px;padding-right:28px;}
  
  /* STAT STRIP - 2 columns on tablets */
  .stat-strip{
    grid-template-columns:repeat(2,1fr);
  }
  .stat:nth-child(2){border-right:none;}
  .stat:nth-child(3){border-bottom:none;}
  .stat:nth-child(4){border-bottom:none;}
  
  /* STORY - single column */
  .story{
    grid-template-columns:1fr;
    gap:34px;
  }
  
  /* VALUES & FEATURES - 2 columns on tablets */
  .values-grid{
    grid-template-columns:repeat(2,1fr);
  }
  
  .nav-links{display:none;}

  /* HERO - logo on top, text below */
  .hero-grid{
    grid-template-columns:1fr;
    gap:30px;
    text-align:center;
    min-height:auto;
  }
  
  .hero-media{
    justify-content:center;
    order:-1; /* Logo on top */
    min-height:300px;
    padding:20px;
    background:transparent;
  }
  
  .hero-media img{
    max-width:380px;
    max-height:300px;
    height:auto;
    object-fit:contain;
  }
  
  .hero-copy{
    text-align:center;
    order:0;
    padding-right:0;
  }
  
  .hero-title{
    max-width:100%;
    margin:0 auto;
  }
  
  .hero-lead{
    max-width:100%;
    margin-right:20px
  }
}

/* SMALL SCREENS (mobile) */
@media(max-width:560px){
  /* STAT STRIP - 1 column on mobile */
  .stat-strip{
    grid-template-columns:1fr;
  }
  .stat{
    border-right:none;
    border-bottom:1px solid var(--card-border);
    text-align:center;
  }
  .stat:last-child{border-bottom:none;}
  
  /* HERO - logo on top */
  .hero-media{
    min-height:200px;
    padding:10px;
  }
  
  .hero-media img{
    max-width:280px;
    max-height:200px;
  }
  
  /* STORY - single column */
  .story{
    grid-template-columns:1fr;
    gap:24px;
  }
  
  /* STORY CARD - full width on mobile */
  .story-card{
    padding:28px 20px;
  }
  .story-card blockquote{
    font-size:1.1rem;
  }
  
  /* VALUES & FEATURES - 1 column on mobile */
  .values-grid{
    grid-template-columns:1fr;
    gap:16px;
  }
  
  /* VALUE CARDS - stack vertically */
  .value-card{
    padding:24px 20px;
  }
  
  /* CTA - smaller padding */
  .cta{
    padding:60px 24px;
  }
  
  .cta-btns{
    flex-direction:column;
    align-items:center;
  }
  
  .btn{
    width:100%;
    justify-content:center;
  }
}

/* LARGE SCREENS - ensure logo is on the far right filling the entire space */
@media(min-width:992px){
  .hero-grid{
    grid-template-columns:1fr 1fr;
    gap:0;
  }
  
  .hero-media{
    justify-content:center;
    align-items:center;
    order:2; /* Forces logo to the right */
    min-height:450px;
    padding:20px;
    background:var(--ink);
  }
  
  .hero-media img{
    width:100%;
    height:100%;
    max-height:550px;
    object-fit:contain;
  }
  
  .hero-copy{
    order:1;
    text-align:left;
    padding-right:48px;
    padding-left:0;
  }
}
`;

function AboutPage() {
  const onNavigate = useNavigate();
  return (
    <>
      <style>{STYLES}</style>

      <nav className="nav">
        <div className="nav-links">
          <a href="#story">História</a>
          <a href="#values">Valores</a>
          <a href="#features">Funcionalidades</a>
          <a href="#creator">Criador</a>
        </div>
      </nav>

      {/* HERO */}
      <header
        className="hero"
        style={{
          background: "var(--ink)",
          color: "var(--cream)",
          padding: "60px 0",
          overflow: "hidden",
        }}
      >
        <div className="container-fluid px-md-5">
          <div className="row align-items-center flex-column-reverse flex-lg-row">
            {/* LADO ESQUERDO: Texto (Em mobile fica abaixo) */}
            <div
              className="col-12 col-lg-6 text-center text-lg-start mt-4 mt-lg-0"
              style={{ paddingRight: "min(48px, 5%)" }}
            >
              <div
                className="hero-eyebrow"
                style={{
                  color: "var(--accent)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                Sobre o {COMPANY_NAME}.net
              </div>
              <h1
                className="hero-title"
                style={{
                  fontFamily: "var(--serif)",
                  fontWeight: 900,
                  fontSize: "clamp(2.3rem, 5vw, 4.2rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-1.5px",
                }}
              >
                Negócios online, encomendas mais{" "}
                <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
                  rápidas.
                </em>
              </h1>
              <p
                className="hero-lead"
                style={{
                  marginTop: "24px",
                  fontSize: "1rem",
                  color: "#cbc6bf",
                  fontWeight: 400,
                  maxWidth: "54ch",
                  marginInline: "auto inherit",
                }}
              >
                O {COMPANY_NAME}.net aproxima negócios e clientes em Cabo Verde.{" "}
                <br />
                Qualquer empresa, independentemente da dimensão <br /> pode
                estar presente na plataforma.
                <br />E qualquer cliente pode encomendar online de forma rápida
                e cómoda.
              </p>
            </div>

            {/* LADO DIREITO: Logótipo (Em mobile fica no topo, 100% de largura e centrado) */}
            <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center p-0 ">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/logo.png"
                  alt={`Logótipo animado da ${COMPANY_NAME} em erupção`}
                  style={{
                    // Em ecrãs pequenos ocupa 85% da largura total do dispositivo.
                    // Em ecrãs grandes (desktop), expande dinamicamente até um máximo ideal.
                    width: "100vw",
                    maxWidth: "1200px",
                    marginLeft: "50px",

                    // Mantém a proporção perfeita da imagem sem distorcer
                    height: "auto",
                    maxHeight: "70vh",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* STAT STRIP */}
      <div className="wrap">
        <div className="stat-strip">
          <div className="stat">
            <div className="stat-num">
              100<span>%</span>
            </div>
            <div className="stat-label">Encomendas online</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              24<span>/7</span>
            </div>
            <div className="stat-label">Sempre disponível</div>
          </div>
          <div className="stat">
            <div className="stat-num">Todas</div>
            <div className="stat-label">Empresas, qualquer dimensão</div>
          </div>
          <div className="stat">
            <div className="stat-num">1</div>
            <div className="stat-label">Plataforma para tudo</div>
          </div>
        </div>
      </div>

      {/* STORY */}
      <section id="story" className="wrap">
        <div className="story">
          <div className="story-text">
            <div className="section-eyebrow">A Nossa História</div>
            <h2 className="section-title">
              De um projeto de estudante a uma ferramenta para Cabo Verde.
            </h2>
            <p>
              A {COMPANY_NAME} nasceu da ideia de um estudante de Engenharia
              Informática que acreditava que comprar e vender devia ser simples,
              rápido e acessível a qualquer negócio.
            </p>
            <p>
              O objetivo era claro: dar a Cabo Verde uma plataforma onde
              qualquer empresa — independentemente da dimensão — possa
              apresentar-se e receber encomendas online.
            </p>
            <p>
              Para os clientes, significa encomendar de forma muito mais rápida
              e cómoda. Para os empregadores, significa gerir o negócio e a
              equipa a partir de um só lugar.
            </p>
            <p>
              A visão continua a mesma: tornar a vida de cada utilizador mais
              fácil, aproximando negócios e clientes através de uma experiência
              digital simples.
            </p>
          </div>
          <div className="story-card">
            <span className="quote-mark">&ldquo;</span>
            <blockquote>
              Quero que qualquer negócio, por mais pequeno que seja, possa estar
              online — e que encomendar seja tão simples como deve ser.
            </blockquote>
            <cite>
              <b>{creatorName}</b>Fundador &amp; Programador
            </cite>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section id="values" className="wrap">
        <div className="section-eyebrow">Aquilo em que Acreditamos</div>
        <h2 className="section-title">Os princípios que guiam cada decisão.</h2>
        <p className="section-intro">
          Não são frases bonitas numa parede — são a forma como decidimos o que
          construir e o que nunca vamos comprometer.
        </p>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <h3>Pensado para Cabo Verde</h3>
            <p>
              Construído de raiz para a realidade dos negócios Cabo Verdianos,
              das pequenas equipas às maiores operações.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <h3>Confiança em Primeiro Lugar</h3>
            <p>
              Tratamos os seus dados e os dos seus clientes com o máximo
              cuidado, com transparência e sem surpresas.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="bi bi-magic"></i>
            </div>
            <h3>Simplicidade Acima de Tudo</h3>
            <p>
              Se uma funcionalidade não torna o seu dia mais simples, não entra.
              Menos cliques, menos atrito.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <h3>Acesso para Todos</h3>
            <p>
              Quer seja um negócio de uma pessoa ou uma equipa inteira, a
              plataforma é igual para todos.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="bi bi-lightning-charge-fill"></i>
            </div>
            <h3>Rápido e Cómodo</h3>
            <p>
              Encomendar leva segundos, não idas e voltas. Menos tempo a tratar
              de pedidos, mais tempo para o que importa.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="bi bi-chat-heart-fill"></i>
            </div>
            <h3>Apoio Real</h3>
            <p>
              Quando precisar de ajuda, fala com pessoas. Sem labirintos de
              menus nem respostas automáticas.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="wrap">
        <div className="section-eyebrow">O Que Pode Fazer</div>
        <h2 className="section-title">
          Uma plataforma, várias formas de simplificar o seu dia.
        </h2>
        <p className="section-intro">
          Tudo o que precisa para colocar o negócio online e para encomendar sem
          complicações, num único sítio.
        </p>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <i className="bi bi-shop"></i>
            </div>
            <h3>Qualquer Empresa, Online</h3>
            <p>
              Pequena ou grande, qualquer negócio pode apresentar-se na
              plataforma e chegar a novos clientes.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="bi bi-cart-check-fill"></i>
            </div>
            <h3>Encomendas Rápidas</h3>
            <p>
              Os clientes encontram o que precisam e encomendam em segundos, de
              forma simples e cómoda.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="bi bi-person-badge"></i>
            </div>
            <h3>Gestão do Negócio e da Equipa</h3>
            <p>
              Os empregadores acompanham encomendas, gerem a equipa e controlam
              as operações num só painel.
            </p>
          </div>
        </div>
      </section>

      {/* CREATOR */}
      <section id="creator" className="wrap">
        <div className="section-eyebrow">Quem Está Por Trás</div>
        <h2 className="section-title">Um estudante, uma missão.</h2>
        <p className="section-intro">
          A {COMPANY_NAME} é um projeto independente, construído por uma só
          pessoa com uma ideia muito clara.
        </p>
        <div className="creator-wrap">
          <div className="member">
            <div className="member-banner">
              <div className="member-avatar">
                {creatorName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
            <div className="member-body">
              <div className="member-name">{creatorName}</div>
              <div className="member-role">Fundador &amp; Programador</div>
              <p className="member-bio">
                Estudante de Engenharia Informática em Cabo Verde. Criou a{" "}
                {COMPANY_NAME} sozinho, convicto de que qualquer negócio merece
                estar online e que encomendar devia ser simples e rápido.
              </p>
              {/* <div className="member-socials"><a href="#"><i className="bi bi-linkedin"></i></a><a href="#"><i className="bi bi-github"></i></a></div> */}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Pronto para levar o seu negócio para online?</h2>
        <p>
          Junte-se à {COMPANY_NAME} — qualquer empresa, de qualquer dimensão,
          pode começar a receber encomendas online.
        </p>
        <div className="cta-btns">
          <a
            className="btn primary"
            onClick={() => onNavigate("/employer-register")}
          >
            <i className="bi bi-rocket-takeoff"></i> Começar Agora
          </a>
          {/* <a href="#" className="btn ghost"><i className="bi bi-envelope"></i> Falar Connosco</a> */}
        </div>
      </section>

      <GetFooterSection />
    </>
  );
}

export default AboutPage;
