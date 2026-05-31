import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StaffModel, CompanyModel, ProductModel } from "../../../api/interfaces";
import {
  getStaffProfile,
  getCompanyDashboard,
  getProductsByCompanyId,
  logoutEntity,
} from "../../../api/requests";

import StaffSidebar from "./StaffSidebar";
import StaffTopbar from "./StaffTopbar";

import "../../../css/employer-dashboard.css"

import { ResponsiveSidebar } from "../../../hooks/ResponsiveSidebar";
import { useResponsiveSidebar } from "../../../hooks/useResponsiveSidebar";
import StaffOverviewView from "./views/StaffOverviewView";
import GetFooterSection from "../../../components/footer";
import EmployeeStaffView from "./views/StaffView";
import ProductView from "../../company/views/ProductsView";
import StaffProfileView from "./views/StaffProfileView";


export type StaffDashView = "overview" | "profileView" |"companyView" | "settinhgsView" | "staffview" | "productView" | "electronicView" | "tvShowView" | "filmView" | "bookView" | "reviewsView" | "customerView" | "orderView" ;


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

  const sidebar = useResponsiveSidebar(768);

  const handleLogout = (entityType: string) =>{
  logoutEntity(entityType)
  navigate("/")
  };

  const renderView = () => {
    switch (activeView) {
      case "overview":
          return <StaffOverviewView staff={staff} company={company} onNavigate={navigate}/>
      case "staffview": return <EmployeeStaffView company={company}/>
      case "productView": return <ProductView company={company!}/>
      case "profileView": return <StaffProfileView staff={staff!}/>
    }
  };

return (
  <>
     <div className="profile-page" style={{ display: "flex", width: "100vw", minHeight: "100vh" }}>
        <ResponsiveSidebar
          isOpen={sidebar.isOpen}
          isMobile={sidebar.isMobile}
          onOpen={sidebar.open}
          onClose={sidebar.close}
          ariaLabel="Account navigation"
        >
          <StaffSidebar
            company={company!}
            onBack={()=> {navigate("/company-dashboard")}}
            onLogout={handleLogout}
            activeView={activeView}
            onNavigate={(view) => setActiveView(view)}
            staff={staff!}
          />
        </ResponsiveSidebar>
     
      <div className="dash-main" style={{ flexGrow: 1, marginLeft: -25, minWidth: 0 }}>
        <StaffTopbar activeView={activeView} staff={staff} />
        <div className="view active">{renderView()}</div>
      </div>
    </div>
    <GetFooterSection/>
  </>
);
}

export default StaffDashboard;
