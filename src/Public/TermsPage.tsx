// TODO: substituir pelos valores reais

import GetFooterSection from "../Components/GetFooter";
import GetHeader from "../Components/GetHeader";
import { COMPANY_NAME } from "../Interfaces/global";

const contactEmail = "[email de contacto]";
const lastUpdated = "14 de Junho de 2026";

const SECTIONS = [
  {
    id: "aceitacao",
    title: "Aceitação dos Termos",
    items: [
      `Ao aceder ou utilizar o website ${COMPANY_NAME}, o utilizador concorda em ficar vinculado a estes Termos e Condições. Caso não concorde, não deverá utilizar a plataforma.`,
      `Estes Termos aplicam-se a todos os utilizadores, incluindo clientes, empregadores e empresas listadas na plataforma.`,
    ],
  },
  {
    id: "elegibilidade",
    title: "Elegibilidade",
    items: [
      `O utilizador deve ter idade legal para celebrar um contrato vinculativo ao abrigo da legislação aplicável.`,
      `Ao criar uma conta, o utilizador declara que as informações fornecidas são verdadeiras e que está autorizado a representar qualquer empresa que registe.`,
    ],
  },
  {
    id: "responsabilidades",
    title: "Responsabilidades do Utilizador",
    items: [
      `O utilizador é responsável por manter a segurança da  palavra-passe.`,
      `O utilizador é responsável por manter a segurança da seu email.`,
      `O utilizador é responsável por todas as atividades realizadas através da sua conta.`,
    ],
  },
  {
    id: "atividades-proibidas",
    title: "Atividades Proibidas",
    items: [
      `O utilizador não pode carregar, distribuir ou partilhar conteúdo ilegal, prejudicial, difamatório, abusivo, de assédio, fraudulento ou enganoso.`,
      `O utilizador não pode tentar obter acesso não autorizado a outras contas, sistemas ou dados.`,
      `O utilizador não pode interferir com o funcionamento, a segurança ou a disponibilidade da plataforma.`,
      `O utilizador não pode utilizar ferramentas automatizadas, bots ou scripts para abusar da plataforma sem autorização prévia por escrito.`,
    ],
  },
  {
    id: "encomendas-listagens",
    title: "Encomendas e Listagens",
    items: [
      `As empresas são responsáveis pela exatidão das listagens, preços, disponibilidade e descrições dos produtos ou serviços que publicam.`,
      `As encomendas efetuadas através da plataforma constituem um acordo entre o cliente e a empresa correspondente. A ${COMPANY_NAME} disponibiliza a plataforma que liga ambas as partes.`,
      `O website ${COMPANY_NAME} não é responsável pela qualidade, entrega ou cumprimento das encomendas entre clientes e empresas, salvo disposição legal em contrário.`,
    ],
  },
  {
    id: "restricoes-conteudo",
    title: "Restrições de Conteúdo",
    items: [
      `É estritamente proibida, em qualquer circunstância, a publicação de imagens, vídeos ou conteúdos pornográficos, sexualmente explícitos, obscenos ou de outra forma inadequados.`,
      `${COMPANY_NAME} pode remover conteúdo proibido sem aviso prévio.`,
    ],
  },
  {
    id: "suspensao",
    title: "Suspensão e Cancelamento de Conta",
    items: [
      `A ${COMPANY_NAME} pode suspender, restringir ou cancelar qualquer conta que viole estes Termos, a legislação aplicável ou as políticas da plataforma.`,
      `A ${COMPANY_NAME} pode remover conteúdo ou dados que violem estes Termos sem aviso prévio.`,
    ],
  },
  {
    id: "eliminar-entidades",
    title: "Direito de Eliminar Entidades",
    items: [
      `A ${COMPANY_NAME} reserva-se o direito de suspender ou remover permanentemente utilizadores, membros de equipa, empregadores, empresas ou outras entidades que violem estes Termos, a legislação aplicável ou as políticas da plataforma.`,
    ],
  },
  {
    id: "privacidade",
    title: "Privacidade e Acesso a Dados",
    items: [
      `A ${COMPANY_NAME} pode aceder aos dados do utilizador quando razoavelmente necessário para apoio técnico, resolução de problemas, investigações de segurança, cumprimento legal ou manutenção do serviço.`,
      `A ${COMPANY_NAME} trata os dados pessoais de acordo com a sua Política de Privacidade.`,
    ],
  },
  {
    id: "propriedade-intelectual",
    title: "Propriedade Intelectual",
    items: [
      `Todo o conteúdo, marca, software, design, logótipos e marcas registadas da plataforma são propriedade da ${COMPANY_NAME} ou dos seus licenciadores.`,
      `O utilizador não pode copiar, modificar, distribuir ou reproduzir o conteúdo da plataforma sem autorização.`,
    ],
  },
  {
    id: "disponibilidade",
    title: "Disponibilidade do Serviço",
    items: [
      `A ${COMPANY_NAME} não garante o funcionamento ininterrupto ou isento de erros da plataforma.`,
      `As funcionalidades, os recursos, os preços e os serviços podem ser alterados, suspensos ou descontinuados a qualquer momento.`,
    ],
  },
  {
    id: "alteracoes",
    title: "Alterações ao Serviço",
    items: [
      `A ${COMPANY_NAME} reserva-se o direito de modificar, substituir, suspender, descontinuar ou eliminar permanentemente a plataforma, as suas funcionalidades ou quaisquer serviços associados, a qualquer momento e sem aviso prévio.`,
    ],
  },
  {
    id: "limitacao-responsabilidade",
    title: "Limitação de Responsabilidade",
    items: [
      `A plataforma é fornecida «tal como está» e «conforme disponível».`,
      `A ${COMPANY_NAME} não será responsável por danos indiretos, incidentais, consequenciais, especiais ou punitivos decorrentes da utilização da plataforma.`,
    ],
  },
  {
    id: "indemnizacao",
    title: "Indemnização",
    items: [
      `O utilizador concorda em indemnizar e isentar a ${COMPANY_NAME} de quaisquer reclamações, danos, responsabilidades e despesas decorrentes da utilização indevida da plataforma ou da violação destes Termos.`,
    ],
  },
  {
    id: "cumprimento-lei",
    title: "Cumprimento da Lei",
    items: [
      `O utilizador deve cumprir toda a legislação local, regional, nacional e internacional aplicável durante a utilização da plataforma.`,
    ],
  },
  //   {
  //     id: "lei-aplicavel",
  //     title: "Lei Aplicável",
  //     items: [
  //       `Estes Termos são regidos e interpretados de acordo com a legislação de ${jurisdiction}.`,
  //     ],
  //   },
  //   {
  //     id: "contactos",
  //     title: "Contactos",
  //     items: [
  //       `Questões relativas a estes Termos podem ser enviadas para: ${contactEmail}.`,
  //     ],
  //   },
];

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
  padding:78px 0 66px;
}
.hero::after{
  content:'';position:absolute;right:-120px;top:-120px;
  width:420px;height:420px;border-radius:50%;
  background:radial-gradient(circle,rgba(200,69,42,0.4),transparent 70%);
}
.hero-eyebrow{
  font-size:0.72rem;font-weight:700;letter-spacing:0.22em;
  text-transform:uppercase;color:var(--accent);margin-bottom:18px;
}
.hero-title{
  font-family:var(--serif);font-weight:900;
  font-size:clamp(2.4rem,5vw,3.8rem);line-height:1.05;
  letter-spacing:-1.2px;
}
.hero-lead{
  margin-top:22px;max-width:54ch;
  font-size:1.05rem;color:#cbc6bf;font-weight:400;
}
/* ---------- terms layout ---------- */
.terms-section{padding:64px 0 30px;}
.terms-layout{display:grid;grid-template-columns:250px 1fr;gap:60px;align-items:start;}
.toc{position:sticky;top:92px;}
.toc-title{
  font-size:0.7rem;font-weight:700;letter-spacing:0.16em;
  text-transform:uppercase;color:var(--accent);margin-bottom:14px;
}
.toc ol{list-style:none;}
.toc a{
  display:block;font-size:0.84rem;color:var(--mid);text-decoration:none;
  padding:6px 0 6px 14px;border-left:2px solid var(--card-border);
  transition:all 0.15s;
}
.toc a:hover{color:var(--accent);border-color:var(--accent);}
.terms-doc{min-width:0;}
.terms-updated{
  font-family:'DM Mono',monospace;font-size:0.78rem;
  color:var(--mid);letter-spacing:0.03em;margin-bottom:14px;
}
.terms-intro{font-size:1.05rem;color:var(--ink);max-width:66ch;}
.terms-intro + .terms-intro{margin-top:12px;}
.term-block{
  padding:34px 0;border-bottom:1px solid var(--card-border);
  scroll-margin-top:92px;
}
.term-block:last-of-type{border-bottom:none;}
.term-head{display:flex;align-items:baseline;gap:14px;margin-bottom:16px;}
.term-num{
  font-family:'DM Mono',monospace;font-size:0.82rem;font-weight:500;
  color:var(--accent);flex-shrink:0;
}
.term-block h2{
  font-family:var(--serif);font-size:1.4rem;font-weight:700;
  letter-spacing:-0.4px;line-height:1.2;
}
.term-block ul{list-style:none;}
.term-block li{
  position:relative;padding-left:24px;margin-bottom:12px;
  color:var(--mid);font-size:0.96rem;
}
.term-block li:last-child{margin-bottom:0;}
.term-block li::before{
  content:'';position:absolute;left:3px;top:10px;
  width:7px;height:7px;border-radius:50%;
  background:var(--accent);opacity:0.7;
}
.terms-note{
  margin-top:44px;padding:24px 28px;background:#fff;
  border:1px solid var(--card-border);border-left:4px solid var(--accent);
  font-size:0.9rem;color:var(--mid);
}
.terms-note b{color:var(--ink);}
/* ---------- footer ---------- */
.foot{padding:34px 48px;text-align:center;font-size:0.78rem;color:var(--mid);border-top:1px solid var(--card-border);}
.foot span{color:var(--accent);}
/* ---------- responsive ---------- */
@media(max-width:991px){
  .wrap,.nav,.foot{padding-left:28px;padding-right:28px;}
  .nav-links{display:none;}
}
@media(max-width:860px){
  .terms-layout{grid-template-columns:1fr;gap:34px;}
  .toc{position:static;padding-bottom:20px;border-bottom:1px solid var(--card-border);}
}
`;

function TermsPage() {
  return (
    <>
      <style>{STYLES}</style>
      {/* HERO */}
      <header className="hero">
        <div className="wrap">
          <div className="hero-eyebrow">Aspetos Legais</div>
          <h1 className="hero-title">Termos e Condições</h1>
          <p className="hero-lead">
            As regras que regem a utilização da {COMPANY_NAME}. Ao utilizar a
            plataforma, o utilizador concorda com os termos descritos abaixo.
          </p>
        </div>
      </header>

      {/* TERMS */}
      <section className="terms-section">
        <div className="wrap">
          <div className="terms-layout">
            <aside className="toc">
              <div className="toc-title">Índice</div>
              <ol>
                {SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>
                      {String(i + 1).padStart(2, "0")}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="terms-doc">
              <div className="terms-updated">
                Última atualização: {lastUpdated}
              </div>
              <p className="terms-intro">
                Bem-vindo à {COMPANY_NAME}. Estes Termos e Condições estabelecem
                as regras de utilização da plataforma. Leia-os com atenção antes
                de criar uma conta ou efetuar qualquer encomenda.
              </p>

              {SECTIONS.map((s, i) => (
                <div className="term-block" id={s.id} key={s.id}>
                  <div className="term-head">
                    <span className="term-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2>{s.title}</h2>
                  </div>
                  <ul>
                    {s.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GetFooterSection />
    </>
  );
}

export default TermsPage;
