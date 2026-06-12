import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCompanyDashboard,
  getProductsByCompanyId,
  getUserProfileData,
  getCompanyCartItems,
  getAllCompanyAndUserOrders,
} from "../../api/requests";
import { CartItem, CompanyModel, OrderModel, ProductModel, UserProfileModel } from "../../api/interfaces";
import GetFooterSection from "../../components/footer";
import { useResponsiveSidebar } from "../../hooks/useResponsiveSidebar";
import { ResponsiveSidebar } from "../../hooks/ResponsiveSidebar";

import PublicCompanySidebar from "./PublicCompanySidebar";
import PublicTopBar from "./PublicTopBar";
import OverviewView from "./OverviewView";
import ProductsView from "./ProductsView";
import CartView from "./CartView";
import OrdersView from "./OrdersView";

export type PublicView = "overview" | "products" | "cart" | "orders";

function BusinessPublicOverView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sidebar = useResponsiveSidebar(768);

  const [activeView, setActiveView] = useState<PublicView>("overview");
  const [company, setCompany] = useState<CompanyModel | null>(null);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfileModel | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);




  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setLoadError("No business specified.");
        setLoading(false);
        return;
      }
      try {
        const [companyRes, productsRes] = await Promise.all([
          getCompanyDashboard(id),
          getProductsByCompanyId(id),
        ]);

        if (!companyRes.ok) {
          setLoadError(`Could not load this business (${companyRes.status}).`);
          return;
        }
        setCompany(await companyRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());
      } catch (err) {
        console.error("Failed to load business page:", err);
        setLoadError("Could not load this business.");
      } finally {
        setLoading(false);
      }
    };


    const loadUser = async () => {
      try {
        const data = await getUserProfileData();
        console.log("UserData: ", data)
        if (data) setCurrentUser(data);
      } catch {
        /* anonymous visitors are fine */
      }
    };

    loadData();
    loadUser();
  }, [id]);

  const loadCart = async () => {
    if (!currentUser || !company || !company.id) return;
    const response = await getCompanyCartItems(currentUser.id, company.id);
    console.log("CART ITEMS: ", response);
    if (!response) {
      console.log("There was an issue getting the user cart");
      return;
    }
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setCartItems(data);
    }
  };

  const loadOrders = async () => {
    console.log("LOAD ORDERS ACHIEVED")
    if(currentUser?.id && company?.id){
      setLoading(true);
        const response = await getAllCompanyAndUserOrders(currentUser.id, company.id);
        console.log("Response Getting User Orders: ", response);
        setLoading(false);
        if(!response){
          console.log("There was an issue with your request.");
          return;
        }
        if(response.status === 200){
          const data = await response.json();
          console.log("Order data: ", data);
          setOrders(data);
          return;
        }
    }
  }
    
    

  useEffect(() => {
  if (!currentUser || !company) return;
  if (activeView === "orders") loadOrders();
  if (activeView === "cart") loadCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeView]);

  const cartCount = cartItems.reduce((sum, line) => sum + line.quantity, 0);

  if (loading) {
    return <div style={{ padding: "6rem", textAlign: "center", color: "var(--mid)" }}>Loading business…</div>;
  }
  if (loadError || !company) {
    return (
      <div style={{ padding: "6rem", textAlign: "center" }}>
        <p style={{ color: "#c0392b", marginBottom: "1.5rem" }}>{loadError ?? "Business not found."}</p>
        <button className="btn-primary-custom" onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case "overview": return <OverviewView company={company} productCount={products.length} />;
      case "products": return <ProductsView products={products} onLoadCart={loadCart} user={currentUser} company={company} />;
      case "cart": return <CartView company={company} currentUser={currentUser} cartItems={cartItems}/>;
      case "orders": return <OrdersView company={company} currentUser={currentUser} orders={orders} />;
      default: return <OverviewView company={company} productCount={products.length} />;
    }
  };
return (
    <>
      <div className="profile-page" style={{ display: "flex", minHeight: "100vh", background: "var(--cream)" }}>
        <ResponsiveSidebar
          isOpen={sidebar.isOpen}
          isMobile={sidebar.isMobile}
          onOpen={sidebar.open}
          onClose={sidebar.close}
          ariaLabel="Business navigation"
        >
          <PublicCompanySidebar
            company={company}
            activeView={activeView}
            onNavigate={(view) => { setActiveView(view); sidebar.close(); }}
            currentUser={currentUser}
            cartCount={cartCount}
          />
        </ResponsiveSidebar>

        {/* Added gap and overflow handling here */}
        <div 
          className="main-content-area"
          style={{ 
            flex: 1, 
            display: "flex", 
            minWidth: 0, 
            flexDirection: "column",
            gap: "1rem" /* This creates the small gap between topbar/sidebar and content */
          }} 
        >
          <PublicTopBar
            companyName={company.name}
            cartCount={cartCount}
            onCartClick={() => setActiveView("cart")}
          />

          {/* Removed min-height duplication and massive layout shifts */}
          <div className="view active" style={{ flex: 1, width: "100%" }}>
            {renderView()}
          </div>
        </div>
      </div>

      <GetFooterSection />

      <style>{`
        /* Quick fixes to clean up double margins on smaller viewports too */
        @media (max-width: 1000px) {
          .business-about-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </>
  );
}

export default BusinessPublicOverView;