import { act, useEffect, useState } from "react";
import { getEmployerProfile } from "../../../api/requests";
import { StaffModel, EmployerModel } from "../../../api/interfaces";
import { useNavigate } from "react-router-dom";
import EmployerDashSideBar from "./Sidebar";
import TopBar from "./Topbar";
import OverviewView from "./views/OverviewView";
import "../../../css/dashboard.css"
import BusinessesView from "./views/BusinessesView";
import ProductsView from "./views/ProductsView";
import OrdersView from "./views/OrdersView";
import EmployeesView from "./views/EmployeesView";
import CustomersView from "./views/CustumersView";
import SettingsView from "./views/SettingsView";
import { useResponsiveSidebar } from "../../../hooks/useResponsiveSidebar";
import { ResponsiveSidebar } from "../../../hooks/ResponsiveSidebar";
import GetHeader from "../../../components/header";
import GetFooterSection from "../../../components/footer";
import EmployerProfileView from "./views/EmployerProfileView";


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


function EmployerDashboard(){
    console.log(`Username of the person logged in ${localStorage.getItem("username")}`)

    const navigate = useNavigate();
    const [employer, setEmployer] = useState<EmployerModel | null> (null);
    const [activeView, setActiveView] = useState<EmployerDashView>("profile")
    const sidebar = useResponsiveSidebar(768);

      const handleNavigate = (view: EmployerDashView) => {
        setActiveView(view);
        sidebar.close();
      };
    

    useEffect( () => {
    const getEmployer = async () => {
              try {
          const employer = await getEmployerProfile();
          setEmployer(employer)
        } catch (error: any) {
          if (error.status === 403) {
            alert("You do not have the permissions to view this page.");
            navigate("/");
          } else if (error.status === 401) {
            navigate("/login");
          } else {
            console.log("There was an issue with your request.", error);
          }

        }
    };
    getEmployer();
    }, [navigate]) // runs once on mount

   const renderView = () => {
    if(!employer) return <div>Loading ... </div>
    switch (activeView) {
      case "overview":    return <OverviewView />;
      case "businesses":  return <BusinessesView employer={employer}/>;
      case "orders":      return <OrdersView />;
      case "products":    return <ProductsView />;
      case "staffs":      return <EmployeesView />;
      case "customers":   return <CustomersView />;
      case "settings":    return <SettingsView />;
      case "profile":    return <EmployerProfileView />;
  
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
        <TopBar activeView={activeView} />
        <div className="view active">{renderView()}</div>
      </main>
    </div>
     <GetFooterSection/>
  </>
);
}

export default EmployerDashboard;