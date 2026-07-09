import { useNavigate, useParams } from "react-router-dom";
import BusinessSidebar, { BusinessView } from "./BusinessSidebar";
import { useEffect, useRef, useState } from "react";
import { BusinessModel, BusinessStats } from "../../Interfaces/businesses";
import { useResponsiveSidebar } from "../../hooks/useResponsiveSidebar";
import { ProfileModel } from "../../Interfaces/Authentication";
import { OrderModel, USER_TYPE } from "../../Interfaces/global";
import { getProfile, logoutEntity } from "../../Requests/global";
import { getBusinessById, GetBusinessOrders } from "../../Requests/business";
import { ResponsiveSidebar } from "../../hooks/ResponsiveSidebar";
import BusinessHeader from "./BusinessHeader";
import GetFooterSection from "../../Components/GetFooter";
import BusinessOverView from "./Views/OverviewView";
import { ProductModel } from "../../Interfaces/offerings";
import ProductView from "./Views/ProductView";
import OrderView from "./Views/OrderView";
import { GetClientById } from "../../Requests/client";
import { ClientOrderDisplay } from "./Views/types";

function BusinessDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Company Id: ", id);
  const [activeView, setActiveView] = useState<BusinessView>("overview");
  const [clientOrders, setClientOrders] = useState<OrderModel[]>([]);
  const [orderDisplayList, setOrderDisplayList] = useState<
    ClientOrderDisplay[]
  >([]);
  //   const [staffList, setStaffList] = useState<RegisterStaffModel[]>([]);
  const [productList, setProductList] = useState<ProductModel[]>([]);

  const [stats, setStats] = useState<BusinessStats>();
  const [business, setbusiness] = useState<BusinessModel>({
    id: "",
    createdAt: "",
    updatedAt: "",
    name: "",
    type: "OUTROS",
    description: "",
    phoneNumber: "",
    revenue: 0,
    email: "",
    address: {
      country: "CABO_VERDE",
      state: "",
      island: "SAL",
      city: "",
      street: "",
      postalCode: "",
      zone: "",
    },
    status: "OPERACIONAL",
    creatorId: "",
    weeklySchedule: null,
    imagesMetadata: [],
  });

  // Modal state
  //   const [editingStaff, setEditingStaff] = useState<RegisterStaffModel | null>(
  //     null,
  //   );

  //   const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
  //   const [deletingStaff, setDeletingStaff] = useState<RegisterStaffModel | null>(
  //     null,
  //   );

  const staffSectionReference = useRef<HTMLDivElement>(null);
  const sidebar = useResponsiveSidebar(768);

  //const [companyOrders, setCompanyOrders] = useState<OrderModel[]>([]);

  const [currentEmployer, setCurrentEmployer] = useState<ProfileModel | null>(
    null,
  );
  const handleLogout = (entityType: USER_TYPE) => {
    logoutEntity(entityType);
    navigate("/");
  };

  //   const loadCompanyOrders = async (id: string) => {
  //     const response = await getAllCompanyOrders(id);
  //     console.log("Response getting the employer company", response);
  //     if (!response.ok) {
  //       alert("There was an isseu with your request");
  //     }
  //     if (response.status === 200) {
  //       const data = await response.json();
  //       setCompanyOrders(data);
  //     } else if (response.status === 403) {
  //       alert("You do not have access to access this type of data");
  //     } else {
  //       alert(`Therenwas an issue: ${response.text}`);
  //     }
  //   };

  const loadEmployerProfile = async () => {
    try {
      const response = await getProfile("EMPLOYER");
      if (response.ok) {
        const data = await response.json();
        setCurrentEmployer(data);
        return;
      } else if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
      }
    } catch (error: any) {
      console.log("There was an issue with your request.", error);
      alert("Ocorreu um problema ao obter o perfil do(a) empresário(a)");
      return;
    }
  };

  const getBusinessData = async (id: string) => {
    const response = await getBusinessById(id);

    if (response.ok) {
      const data = await response.json();
      setbusiness(data);
      return;
    }
    if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
    } else {
      alert("There was an issue with your request");
      console.log(response);
    }
  };

  const formatOrder = async (orders: OrderModel[]) => {
    if (orders.length === 0) {
      setOrderDisplayList([]);
      return;
    }

    const clientIds = Array.from(new Set(orders.map((o) => o.clientId)));

    try {
      const clients = await Promise.all(
        clientIds.map(async (clientId) => {
          const response = await GetClientById(clientId);
          if (response.ok) {
            return response.json() as Promise<ProfileModel>;
          }
          const errorText =
            response.status >= 400 && response.status < 500
              ? await response.text()
              : "Ocorreu um problema ao obter o cliente";
          throw new Error(errorText);
        }),
      );

      // clientId -> profile cache
      const clientMap = new Map(clients.map((c) => [c.id, c]));

      // one display entry PER ORDER, not per client
      const orderDisplays: ClientOrderDisplay[] = orders
        .map((order) => {
          const client = clientMap.get(order.clientId);
          return client ? { client, order } : null;
        })
        .filter((d): d is ClientOrderDisplay => d !== null);

      setOrderDisplayList(orderDisplays);
    } catch (exception) {
      console.log(exception);
      alert(
        exception instanceof Error
          ? exception.message
          : "Erro ao carregar clientes",
      );
    }
  };

  const loadBusinessOrders = async (id: string) => {
    const response = await GetBusinessOrders(id);
    console.log("Orders Response: ", response);
    if (response.ok) {
      const data = await response.json();
      console.log("Data Order: ", data);
      setClientOrders(data);
      formatOrder(data);
      return;
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
      return;
    } else {
      alert("There was an isseu loading the orders");
      return;
    }
  };

  const renderView = () => {
    if (!business || !currentEmployer) return <div>Loading Company ....</div>;
    switch (activeView) {
      case "overview":
        return <BusinessOverView business={business} />;
      case "productView":
        return <ProductView business={business} />;
      case "orderView":
        return <OrderView orderList={orderDisplayList} />;
      // case "staffview":
      //   return <CompanyStaffView company={company} />;
      //   case "productView":
      //     return <ProductView business={business} />;
      //   case "electronicView":
      //     return <ElectronicView />;
      //   case "orderView":
      //     return (
      //       <CompanyOrderView
      //         orders={companyOrders}
      //         employer={currentEmployer}
      //         company={company}
      //       />
      //     );
    }
  };

  // Keep staff count stat in sync with actual list
  useEffect(() => {
    if (id) {
      loadEmployerProfile();
      getBusinessData(id);
      loadBusinessOrders(id);
    }
  }, [id]);

  // //   useEffect(() => {
  //     if (id && productList && staffList) {
  //       setStats((prev) => ({
  //         ...prev,
  //         staffList: staffList.length,
  //         products: productList.length,
  //       }));
  //     }
  //   }, [staffList]);

  useEffect(() => {
    if (id && productList) {
      setStats((prev) => ({
        ...prev,
        products: productList.length,
      }));
    }
  }, [productList]);

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
          <BusinessSidebar
            business={business!}
            onBack={() => {
              navigate("/business-dashboard");
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
          <BusinessHeader
            businessName={business.name}
            onBack={() => navigate("/employer-dashboard")}
          />
          <div className="view active">{renderView()}</div>
        </div>
      </div>
      <GetFooterSection />
    </>
  );
}

export default BusinessDashboard;
