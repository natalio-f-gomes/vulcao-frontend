import { EmployerDashView } from "./employer-dashboard";

// Maps each view to a human-readable title — like a Map<DashView, String> in Java
const VIEW_TITLES: Record<EmployerDashView, { title: string; sub: string }> = {
  overview:   { title: "Hello.",       sub: "Here's what's happening in your store today." },
  businesses: { title: "My Businesses", sub: "Manage and monitor all your registered businesses." },
  orders:     { title: "Orders",        sub: "Track and manage incoming orders." },
  products:   { title: "Products",      sub: "Manage your product listings." },
  services:   { title: "Services",      sub: "Manage your service offerings." },
  staffs:  { title: "Employees",     sub: "Manage your team members." },
  customers:  { title: "Customers",     sub: "View and manage your customer base." },
  settings:   { title: "Settings",      sub: "Configure your dashboard preferences." },
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
        <button className="topbar-icon-btn" >
          <i className="bi bi-bell"></i>
          <span className="notif-dot"></span>
        </button>
        <button className="topbar-icon-btn">
          <i className="bi bi-search"></i>
        </button>
      </div>
    </div>
  );
}

export default Topbar;