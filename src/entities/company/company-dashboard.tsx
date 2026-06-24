import { useNavigate, useParams } from "react-router-dom";
import CompanyTopBar from "./CompanyTopBar";
import {
  CompanyModel,
  CompanyStats,
  OrderModel,
  ProductModel,
  RegisterStaffModel,
  UserProfileModel,
} from "../../api/interfaces";
import CompanySidebar, { CompanyView } from "./companySideBar";
import {
  getAllCompanyOrders,
  getCompanyDashboard,
  getEmployerProfile,
  logoutEntity,
} from "../../api/requests";
import { useEffect, useRef, useState } from "react";

import { useResponsiveSidebar } from "../../hooks/useResponsiveSidebar";
import { ResponsiveSidebar } from "../../hooks/ResponsiveSidebar";
import GetFooterSection from "../../components/footer";
import CompanyOverviewView from "./views/OverviewView";
import CompanyHeader from "./CompanyTopBar";
import CompanyOverView from "./views/OverviewView";
import CompanyStaffView from "./views/StaffView";
import ProductView from "./views/ProductsView";
import ElectronicView from "./views/ElectronicsView";
import CompanyOrderView from "./views/OrdersView";
import WearableView from "./views/WearableViews";

function CompanyDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Company Id: ", id);
  const [activeView, setActiveView] = useState<CompanyView>("overview");
  const [staffList, setStaffList] = useState<RegisterStaffModel[]>([]);
  const [productList, setProductList] = useState<ProductModel[]>([]);
  const [stats, setStats] = useState<CompanyStats>();
  const [company, setCompany] = useState<CompanyModel>({
    id: "",
    createdAt: "",
    updatedAt: "",
    name: "",
    category: "OUTROS",
    taxIdNumber: "",
    description: "",
    phoneNumber: "",
    faxNumber: "",
    revenue: 0,
    email: "",
    address: {
      island: "",
      city: "",
      street: "",
      postalCode: "",
      zone: "",
    },
    status: null,
    creatorId: "",
    weeklySchedule: null,
  });

  // Modal state
  const [editingStaff, setEditingStaff] = useState<RegisterStaffModel | null>(
    null,
  );
  const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
  const [deletingStaff, setDeletingStaff] = useState<RegisterStaffModel | null>(
    null,
  );
  const staffSectionReference = useRef<HTMLDivElement>(null);
  const sidebar = useResponsiveSidebar(768);
  const [companyOrders, setCompanyOrders] = useState<OrderModel[]>([]);
  const [currentEmployer, setCurrentEmployer] =
    useState<UserProfileModel | null>(null);
  const handleLogout = (entityType: string) => {
    logoutEntity(entityType);
    navigate("/");
  };

  const loadCompanyOrders = async (id: string) => {
    const response = await getAllCompanyOrders(id);
    console.log("Response getting the employer company", response);
    if (!response.ok) {
      alert("There was an isseu with your request");
    }
    if (response.status === 200) {
      const data = await response.json();
      setCompanyOrders(data);
    } else if (response.status === 403) {
      alert("You do not have access to access this type of data");
    } else {
      alert(`Therenwas an issue: ${response.text}`);
    }
  };

  const loadEmployerProfile = async () => {
    try {
      const employer = await getEmployerProfile();
      console.log("Employer profile: ", employer);
      setCurrentEmployer(employer);
      return;
    } catch (error: any) {
      if (error.status === 403) {
        alert("You do not have the permissions to view this page.");
        navigate("/");
      } else if (error.status === 401) {
        navigate("/employer-login");
      } else {
        console.log("There was an issue with your request.", error);
      }
    }
  };

  const getCompanyData = async (id: string) => {
    const response = await getCompanyDashboard(id);
    if (!response.ok) {
      console.log(`There was an issue getting the company Data: ${response}`);
      return;
    }
    if (response.status === 401) {
      alert("You are not logged in. Please login");
      localStorage.removeItem("username");
      localStorage.removeItem("active_role");
      window.location.href = "/staff-login";
    }
    if (response.status === 403) {
      alert("You do not have permissions to visit this page");

      window.location.href = "/";
    }
    const companyData = await response.json();
    setCompany(companyData);
  };

  const renderView = () => {
    if (!company || !currentEmployer) return <div>Loading Company ....</div>;
    switch (activeView) {
      case "overview":
        return <CompanyOverView company={company} />;
      case "staffview":
        return <CompanyStaffView company={company} />;
      case "productView":
        return <ProductView company={company} />;
      case "wearableView":
        return (
          <WearableView
            company={company}
            currentEntity={currentEmployer?.username}
          />
        );
      case "electronicView":
        return <ElectronicView />;
      case "orderView":
        return (
          <CompanyOrderView
            orders={companyOrders}
            employer={currentEmployer}
            company={company}
          />
        );
    }
  };

  // Keep staff count stat in sync with actual list
  useEffect(() => {
    if (id) {
      getCompanyData(id);
      loadEmployerProfile();
      loadCompanyOrders(id);
    }
  }, [id]);

  useEffect(() => {
    if (id && productList && staffList) {
      setStats((prev) => ({
        ...prev,
        staffList: staffList.length,
        products: productList.length,
      }));
    }
  }, [staffList]);

  return (
    <>
      <div className="profile-page" style={{ display: "flex" }}>
        <ResponsiveSidebar
          isOpen={sidebar.isOpen}
          isMobile={sidebar.isMobile}
          onOpen={sidebar.open}
          onClose={sidebar.close}
          ariaLabel="Account navigation"
        >
          <CompanySidebar
            company={company!}
            onBack={() => {
              navigate("/company-dashboard");
            }}
            onLogout={handleLogout}
            activeView={activeView}
            onNavigate={(view) => setActiveView(view)}
          />
        </ResponsiveSidebar>
        <div
          style={{
            flex: 1,
            display: "flex",
            minWidth: 0,
            flexDirection: "column",
          }}
          className="main-content-area"
        >
          <CompanyHeader
            companyName={company.name}
            onBack={() => navigate("/employer-dashboard")}
          />
          <div className="view active">{renderView()}</div>
        </div>
      </div>
      <GetFooterSection />
    </>
  );
}

export default CompanyDashboard;
