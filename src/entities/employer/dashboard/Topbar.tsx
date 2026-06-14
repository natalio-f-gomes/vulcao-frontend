import { EmployerDashView } from "./employer-dashboard";

// Maps each view to a human-readable title — like a Map<DashView, String> in Java
const VIEW_TITLES: Record<EmployerDashView, { title: string; sub: string }> = {
  overview:   { title: "Olá.",       sub: "Aqui está o que se passa na sua loja hoje." },
  businesses: { title: "As Minhas Empresas", sub: "Gerir e monitorizar todas as suas empresas registadas." },
  orders:     { title: "Encomendas",        sub: "Acompanhar e gerir encomendas recebidas." },
  products:   { title: "Produtos",      sub: "Gerir as suas listagens de produtos." },
  services:   { title: "Serviços",      sub: "Gerir as suas ofertas de serviços." },
  staffs:     { title: "Funcionários",     sub: "Gerir os membros da sua equipa." },
  customers:  { title: "Clientes",     sub: "Visualizar e gerir a sua base de clientes." },
  settings:   { title: "Definições",      sub: "Configurar as preferências do seu painel de controlo." },
  profile:    { title: "Olá.",       sub: "Gerir a sua conta" },
};
interface TopbarProps {
  activeView: EmployerDashView;
}

function Topbar({ activeView }: TopbarProps) {
  const { title, sub } = VIEW_TITLES[activeView];

  return (
    <div className="topbar" >
      <div >
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{sub}</div>
      </div>
      <div className="topbar-right" >
        <div className="date-chip">
          <i className="bi bi-calendar3"></i>
          <span>{new Date().toDateString()}</span>
        </div>
        {/* 
        <button className="topbar-icon-btn" >
          <i className="bi bi-bell"></i>
          <span className="notif-dot"></span>
        </button>
        <button className="topbar-icon-btn">
          <i className="bi bi-search"></i>
        </button>
        */}
      </div>
    </div>
  );
}

export default Topbar;