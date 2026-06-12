import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GetUserDashBoard from "./views/UserDashboard";
import UserCartView from "./views/UserCartView";
import UserOrderView from "./views/UserOrderView";
import UserDashSideBar from "./components/SideBar";
import { useResponsiveSidebar } from "../../../hooks/useResponsiveSidebar";
import { ResponsiveSidebar } from "../../../hooks/ResponsiveSidebar";
import GetHeader from "../../../components/header";
import GetFooterSection from "../../../components/footer";
import {
  CartItem,
  OrderModel,
  ProductModel,
  UserProfileModel,
} from "../../../api/interfaces";
import {
  getAllUserOrders,
  getProductById,
  getUserCartItems,
  getUserProfileData,
} from "../../../api/requests";
import "../../../css/dashboard.css";


export type UserDashView = "overview" | "cart" | "orders" | "security" | "contact" | "personalInfo" | "address";

export interface CartProductModel extends ProductModel {
  quantity: number;
}

function GetUserAccountPage() {
  const [currentView, setCurrentView] = useState<UserDashView>("overview");
  const [currentUser, setCurrentUser] = useState<UserProfileModel | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<CartProductModel[]>([]);
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const navigate = useNavigate();
  const sidebar = useResponsiveSidebar(768);

  const handleNavigate = (view: UserDashView) => {
    setCurrentView(view);
    sidebar.close();
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await getUserProfileData();
        if (!userData) return;

        localStorage.setItem("username", userData.username);
        setCurrentUser(userData);

        const ordersResponse = await getAllUserOrders(userData.id)
        console.log("Orders response: ", ordersResponse)
        if(!ordersResponse || !ordersResponse.ok){
            console.log("There was an issue with your order");
            return;
        }
        if(ordersResponse.status===200){
          const orderData = await ordersResponse.json();
          setOrders(orderData)
        }
      } catch (error) {
        console.error("Network or API error ", error);
      }
    };
    getCurrentUser();
  }, [navigate]);

  const renderView = () => {
    if (!currentUser) return <div>Loading...</div>;
    switch (currentView) {
      case "overview":
        return <GetUserDashBoard />;
      case "cart":
        return <UserCartView products={products} />;
      case "orders":
        return <UserOrderView orders={orders} />;
      case "security":
        return <div>Security settings coming soon</div>;
      default:
        return <GetUserDashBoard />;
    }
  };

  return (
    <>
      <GetHeader />
      <div className="profile-page">
        <ResponsiveSidebar
          isOpen={sidebar.isOpen}
          isMobile={sidebar.isMobile}
          onOpen={sidebar.open}
          onClose={sidebar.close}
          ariaLabel="Account navigation"
        >
          <UserDashSideBar
            currentView={currentView}
            onNavigate={handleNavigate}
            currentUser={currentUser!}
          />
        </ResponsiveSidebar>
        <div className="view active">{renderView()}</div>
      </div>
      <GetFooterSection />
    </>
  );
}

export default GetUserAccountPage;