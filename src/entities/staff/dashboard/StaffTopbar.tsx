import { StaffModel } from "../../../api/interfaces";
import { StaffDashView } from "./StaffDashboard";



interface StaffTopbarProps {
  activeView: StaffDashView;
  staff: StaffModel | null;
}

const VIEW_TITLES: Record<StaffDashView, { title: string; sub: string }> = {
  overview:       { title: "Olá.",                    sub: "Aqui está o que se passa no trabalho hoje." },
  companyView:    { title: "A Minha Empresa",         sub: "Detalhes sobre a empresa onde trabalha." },
  orderView:      { title: "Encomendas",              sub: "Acompanhar e processar encomendas de clientes." },
  productView:    { title: "Produtos",                sub: "Gerir listagens de produtos." },
  electronicView: { title: "Eletrónicos",             sub: "Gerir listagens de produtos eletrónicos." },
  filmView:       { title: "Filmes",                  sub: "Gerir as suas listagens de filmes." },
  tvShowView:     { title: "Programas TV",            sub: "Gerir as suas listagens de programas de TV." },
  bookView:       { title: "Livros",                  sub: "Gerir as suas listagens de livros." },
  staffview:      { title: "Colegas",                 sub: "Lista dos seus colegas de trabalho." },
  customerView:   { title: "Clientes",                sub: "Ajudar e acompanhar os clientes." },
  profileView:    { title: "O Meu Perfil",            sub: "As suas informações pessoais e permissões." },
  settinhgsView:  { title: "Definições",              sub: "Configurar as preferências do seu painel de controlo." },
  reviewsView:    { title: "Avaliações",              sub: "Verificar as avaliações da sua empresa e colegas." },
  wearableView: { title: "Vestiveis",             sub: "Consultar, editar e organizar os artigos de vestuário." },
};

function StaffTopbar({ activeView, staff }: StaffTopbarProps) {
    const { title, sub } = VIEW_TITLES[activeView];
   const displayTitle =
    activeView === "overview" && staff
      ? `Hello, ${staff.firstName}.`
      : title;

  return (
    <div className="topbar" style={{ width: '100%' }}>
    <div>
      <div className="topbar-title">{displayTitle}</div>
        <div className="topbar-sub">{sub}</div>
      </div>
      <div className="topbar-right">
      <div className="date-chip">
        <i className="bi bi-calendar3"></i>
        <span>
          {new Date().toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </span>
      </div>


        {/*
        <button className="topbar-icon-btn">
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

export default StaffTopbar;
