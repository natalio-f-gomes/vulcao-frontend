import { act, useEffect, useState } from "react";
import { getEmployerProfile } from "../../../api/requests";
import { StaffModel, EmployerModel } from "../../../api/interfaces";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import OverviewView from "./views/OverviewView";
import "../../../css/employer-dashboard.css"
import "../../../css/side-bar.css"
import BusinessesView from "./views/BusinessesView";
import ProductsView from "./views/ProductsView";
import OrdersView from "./views/OrdersView";
import EmployeesView from "./views/EmployeesView";
import CustomersView from "./views/CustumersView";
import SettingsView from "./views/SettingsView";


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
        <Sidebar activeView={activeView} onNavigate={setActiveView} employer={employer}/>
        <div className="dash-main">
            <TopBar activeView={activeView} />
            <div className="view active"> {renderView()}</div>
        </div>
        </>
    )
}

export default EmployerDashboard;