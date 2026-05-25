import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StaffModel, CompanyModel, ProductModel } from "../../../api/interfaces";
import {
  getStaffProfile,
  getCompanyDashboard,
  getProductsByCompanyId,
} from "../../../api/requests";

import StaffSidebar from "./StaffSidebar";
import StaffTopbar from "./StaffTopbar";

import StaffCustomersView from "./views/StaffCustomersView";
import MyCompanyView from "./views/MyCompanyView";
import StaffOverviewView from "./views/StaffOverviewView";
import StaffOrdersView from "./views/StaffOrdersView";
import StaffProfileView from "./views/StaffProfileView";
import StaffSettingsView from "./views/StaffSettingsView";
import StaffProductsView from "./views/StaffProductsView";
import "../../../css/employer-dashboard.css"
import "../../../css/side-bar.css"



export type StaffDashView =
  | "overview"
  | "company"
  | "orders"
  | "products"
  | "customers"
  | "profile"
  | "settings";

function StaffDashboard() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState<StaffModel | null>(null);
  const [company, setCompany] = useState<CompanyModel | null>(null);
  const [activeView, setActiveView] = useState<StaffDashView>("overview");
  const [productList, setProductList] =  useState<ProductModel[]>([]);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const response = await getStaffProfile();

        if (response.status === 401 || response.status === 403) {
          alert("You do not have permission to view this page");
          navigate("/");
          return;
        }
        if (!response.ok) {
          console.log("Error fetching staff profile", response);
          return;
        }

        const data: StaffModel = await response.json();
        localStorage.setItem("username", data.username);
        setStaff(data);

        // Load the single company this staff member belongs to.
        // Staff can ONLY see their own company — never a list.
        if (data.companyId) {
          const companyResponse = await getCompanyDashboard(data.companyId);
          if (companyResponse.ok) {
            const companyData = await companyResponse.json();
            setCompany(companyData);
          }

          const productResponse = await getProductsByCompanyId(data.companyId);
          if (productResponse.ok) {
            const products = await productResponse.json();
            setProductList(products);
          }

        }
      } catch (err) {
        console.error("Failed to load staff profile:", err);
      }
    };
    loadStaff();
  }, [navigate]);

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return (
          <StaffOverviewView
            staff={staff}
            company={company}
            onNavigate={setActiveView}
          />
        );
      case "company":   return <MyCompanyView company={company} />;
      case "orders":    return <StaffOrdersView companyId={staff?.companyId} />;
      case "products":  return <StaffProductsView products={productList!} staff={staff!} company={company!} />;
      case "customers": return <StaffCustomersView />;
      case "profile":   return <StaffProfileView staff={staff} />;
      case "settings":  return <StaffSettingsView />;
    }
  };

  return (
    <>
      <StaffSidebar
        activeView={activeView}
        onNavigate={setActiveView}
        staff={staff}
        productCount={productList.length}
      />

      <div className="dash-main">
        <StaffTopbar activeView={activeView} staff={staff} />
        <div className="view active">{renderView()}</div>
      </div>
    </>
  );
}

export default StaffDashboard;
