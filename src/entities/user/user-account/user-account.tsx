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
  ProductModel,
  UserProfileModel,
} from "../../../api/interfaces";
import {
  getProductById,
  getUserCartItems,
  getUserProfileData,
} from "../../../api/requests";
import "../../../css/dashboard.css";


export type UserDashView = "overview" | "cart" | "orders" | "security";

export interface CartProductModel extends ProductModel {
  quantity: number;
}

function GetUserAccountPage() {
  const [currentView, setCurrentView] = useState<UserDashView>("overview");
  const [currentUser, setCurrentUser] = useState<UserProfileModel | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<CartProductModel[]>([]);
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

        const cartItemResponse = await getUserCartItems(userData.id);

        if (cartItemResponse && cartItemResponse.ok) {
          const data: CartItem[] = await cartItemResponse.json();
          setCartItems(data);

          const productItems = data.filter((item) => item.itemType === "PRODUCT");
          const productPromises = productItems.map(async (item) => {
            const response = await getProductById(item!.id!);
            if (response.ok) {
              const productData = await response.json();
              return { ...productData, quantity: item.quantity };
            }
            return null;
          });

          const resolvedProducts = await Promise.all(productPromises);
          const validProducts = resolvedProducts.filter(
            (p) => p !== null
          ) as CartProductModel[];
          setProducts(validProducts);
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
        return <UserOrderView />;
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