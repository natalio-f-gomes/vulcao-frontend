import { useNavigate } from "react-router-dom";
import { ProfileModel } from "../../../Interfaces/Authentication";
import { useEffect, useState } from "react";
import { useResponsiveSidebar } from "../../../hooks/useResponsiveSidebar";
import { getProfile } from "../../../Requests/global";
import OverviewView from "./views/OverviewView";
import EmployerProfileView from "./views/EmployerProfileView";
import { ResponsiveSidebar } from "../../../hooks/ResponsiveSidebar";
import EmployerDashSideBar from "./Sidebar";
import GetFooterSection from "../../../Components/getFooter";
import EmployerTopbar from "./Topbar";
import "../../../css/employer-dashboard.css";
import BusinessesView from "./views/BusinessView";

export type EmployerDashView =
  | "overview"
  | "businesses"
  | "orders"
  | "products"
  | "profile"
  | "services"
  | "staffs"
  | "customers"
  | "settings";

function EmployerDashboard() {
  console.log(
    `Username of the person logged in ${localStorage.getItem("username")}`,
  );

  const navigate = useNavigate();
  const [employer, setEmployer] = useState<ProfileModel | null>(null);
  const [activeView, setActiveView] = useState<EmployerDashView>("profile");
  const sidebar = useResponsiveSidebar(768);

  const handleNavigate = (view: EmployerDashView) => {
    setActiveView(view);
    sidebar.close();
  };

  useEffect(() => {
    const getEmployer = async () => {
      try {
        const response = await getProfile("EMPLOYER");
        if (response.status === 200) {
          const employer = await response.json();
          setEmployer(employer);
        } else if (response.status === 403) {
          alert(
            "Por favor, faça login como empresário(a) para acessar esta página",
          );
        } else {
          console.log("Houve um problema com a sua solicitação.");
          alert("Houve um problema com a sua solicitação.");
        }
      } catch (error: any) {
        alert("Houve um problema com a sua solicitação.");
        console.log("There was an issue with your request.", error);
      }
    };
    getEmployer();
  }, [navigate]); // runs once on mount

  const renderView = () => {
    if (!employer) return <div>Loading ... </div>;
    switch (activeView) {
      case "overview":
        return <OverviewView />;
      case "businesses":
        return <BusinessesView employer={employer} />;
      //   case "orders":
      //     return <OrdersView />;
      //   case "products":
      //     return <ProductsView />;
      //   case "staffs":
      //     return <EmployeesView />;
      //   case "customers":
      //     return <CustomersView />;
      //   case "settings":
      //     return <SettingsView />;
      case "profile":
        return <EmployerProfileView />;
    }
  };
  return (
    <>
      <div className="profile-page">
        <ResponsiveSidebar
          isOpen={sidebar.isOpen}
          isMobile={sidebar.isMobile}
          onOpen={sidebar.open}
          onClose={sidebar.close}
          ariaLabel="Account navigation"
        >
          <EmployerDashSideBar
            activeView={activeView}
            onNavigate={handleNavigate}
            employer={employer!}
          />
        </ResponsiveSidebar>

        <main style={{ flex: 1, minWidth: 0 }}>
          <EmployerTopbar activeView={activeView} />
          <div className="view active">{renderView()}</div>
        </main>
      </div>
      <GetFooterSection />
    </>
  );
}

export default EmployerDashboard;
