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


export type EmployerDashView =
  | "overview"
  | "businesses"
  | "orders"
  | "products"
  | "services"
  | "staffs"
  | "customers"
  | "settings";


function EmployerDashboard(){
    console.log(`Username of the person logged in ${localStorage.getItem("username")}`)

    const navigate = useNavigate();
    const [employer, setEmployer] = useState<EmployerModel | null> (null);
    const [activeView, setActiveView] = useState<EmployerDashView>("overview")
    const sidebar = useResponsiveSidebar(768);

      const handleNavigate = (view: EmployerDashView) => {
        setActiveView(view);
        sidebar.close();
      };
    

    useEffect( () => {
    const getEmployer = async () => {
        const response = await getEmployerProfile();
        if(!response.ok){
            console.log("There was an issue with your request. ", response)
        }else if(response.status === 401 || response.status === 403){
            alert("You do not have the permissions to view this page")
            navigate("/")
        }
        else{
            const data = await response.json();
            localStorage.setItem("username", data.username)
            setEmployer(data)
            console.log(data)
        }
    };
    getEmployer();
    }, [navigate]) // runs once on mount

   const renderView = () => {
    if(!employer) return <div>Loading ... </div>
    switch (activeView) {
      case "overview":    return <OverviewView />;
      case "businesses":  return <BusinessesView />;
      case "orders":      return <OrdersView />;
      case "products":    return <ProductsView />;
      case "staffs":      return <EmployeesView />;
      case "customers":   return <CustomersView />;
      case "settings":    return <SettingsView />;
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