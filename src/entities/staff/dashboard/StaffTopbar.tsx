import { StaffModel } from "../../../api/interfaces";
import { StaffDashView } from "./StaffDashboard";

const VIEW_TITLES: Record<StaffDashView, { title: string; sub: string }> = {
  overview:  { title: "Hello.",      sub: "Here's what's happening at work today." },
  company:   { title: "My Company",  sub: "Details about the company you work for." },
  orders:    { title: "Orders",      sub: "Track and process customer orders." },
  products:  { title: "Products",    sub: "Manage product listings." },
  customers: { title: "Customers",   sub: "Help and follow up with customers." },
  profile:   { title: "My Profile",  sub: "Your personal information and permissions." },
  settings:  { title: "Settings",    sub: "Configure your dashboard preferences." },
};

interface StaffTopbarProps {
  activeView: StaffDashView;
  staff: StaffModel | null;
}

function StaffTopbar({ activeView, staff }: StaffTopbarProps) {
  const { title, sub } = VIEW_TITLES[activeView];

  // Personalize the greeting on the overview page
  const displayTitle =
    activeView === "overview" && staff
      ? `Hello, ${staff.firstName}.`
      : title;

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{displayTitle}</div>
        <div className="topbar-sub">{sub}</div>
      </div>
      <div className="topbar-right">
        <div className="date-chip">
          <i className="bi bi-calendar3"></i>
          <span>{new Date().toDateString()}</span>
        </div>
        <button className="topbar-icon-btn">
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

export default StaffTopbar;
