import { StaffModel } from "../../../api/interfaces";
import { StaffDashView } from "./StaffDashboard";



interface StaffTopbarProps {
  activeView: StaffDashView;
  staff: StaffModel | null;
}

const VIEW_TITLES: Record<StaffDashView, { title: string; sub: string }> = {
  overview:  { title: "Hello.",      sub: "Here's what's happening at work today." },
  companyView:   { title: "My Company",  sub: "Details about the company you work for." },
  orderView:    { title: "Orders",      sub: "Track and process customer orders." },
  productView:  { title: "Products",    sub: "Manage product listings." },
  electronicView:  { title: "Electronics",    sub: "Manage Electronic Product listings." },
  filmView:  { title: "Films",    sub: "Manage your films listings." },
  tvShowView:  { title: "TV Show",    sub: "Manage your TV Show listings." },
  bookView:  { title: "Books",    sub: "Manage your Bookslistings." },
  staffview:  { title: "Co Workers",    sub: "Your Co workers List" },
  customerView: { title: "Customers",   sub: "Help and follow up with customers." },
  profileView:   { title: "My Profile",  sub: "Your personal information and permissions." },
  settinhgsView:  { title: "Settings",    sub: "Configure your dashboard preferences." },
  reviewsView:  { title: "Reviews",    sub: "Check the reviews of your company and co workers" },
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
