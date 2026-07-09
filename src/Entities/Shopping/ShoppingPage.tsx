import { useEffect, useState } from "react";
import GetFooterSection from "../../Components/GetFooter";
import GetHeader from "../../Components/GetHeader";
import { ResponsiveSidebar } from "../../hooks/ResponsiveSidebar";
import { useResponsiveSidebar } from "../../hooks/useResponsiveSidebar";
import ShoppingSidebar, { ShoppingView } from "./SideBar";
import ShoppingTopBar from "./Topbar";
import { BusinessCart, OrderDisplay } from "./types";
import { CartModel } from "../../Interfaces/offerings";
import { OrderModel } from "../../Interfaces/global";
import {
  CancelOrder,
  DeleteCartItem,
  GetClientCart,
  GetClientOrders,
  UpdateCartItem,
} from "../../Requests/shopping";
import { Link, useNavigate } from "react-router-dom";
import "../../css/cart-page.css";
import CartView from "./Views/CartView";
import OrderView from "./Views/OrderView";
import { getBusinessById } from "../../Requests/business";
import { BusinessModel } from "../../Interfaces/businesses";

function ShoppingPage() {
  const navigate = useNavigate();
  const sidebar = useResponsiveSidebar(768);
  const [activeView, setActiveView] = useState<ShoppingView>("cartView");

  const [clientCart, setClientCart] = useState<CartModel | null>(null);
  const [businessCart, setBusinessCart] = useState<BusinessCart[]>([]);
  const [clientOrders, setClientOrders] = useState<OrderModel[]>([]);

  const [orderDisplayList, setOrderDisplayList] = useState<OrderDisplay[]>([]);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await GetClientCart();
        if (response.status === 200) {
          const data = await response.json();
          if (!data) {
            return;
          }
          setClientCart(data);
        }
      } catch (error) {
        console.error("Network or API error ", error);
      }
    };

    const getOrders = async () => {
      try {
        const response = await GetClientOrders();
        if (response.status === 200) {
          const data = await response.json();
          if (!data) {
            return;
          }
          setClientOrders(data);
          console.log("Order: ", data);
        }
      } catch (error) {
        console.error("Network or API error ", error);
      }
    };
    getOrders();
    getCart();
  }, [navigate]);

  //SECOND useEffect that runs when the cart is modified
  useEffect(() => {
    if (!clientCart || !clientCart.items || clientCart.items.length === 0) {
      return;
    }
    const fetchBusinesses = async () => {
      //unique business ids
      const businesesIdSet = new Set(
        clientCart.items.map((item) => item.offering.businessId),
      );
      console.log("businesesIdSet ", businesesIdSet);

      try {
        const promises: Promise<BusinessModel>[] = Array.from(
          businesesIdSet,
        ).map(async (businessId) => {
          const response: Response = await getBusinessById(businessId);
          if (!response.ok) {
            console.log(response);
          }
          return response.json() as Promise<BusinessModel>;
        });
        const businesses: BusinessModel[] = await Promise.all(promises);
        console.log("Companies ", businesses);

        const formattedCart: BusinessCart[] = businesses.map((business) => {
          const offerings = clientCart.items
            .filter((item) => item.offering.businessId === business.id)
            .map((item) => ({
              id: item.offering.id!,
              name: item.offering.name!,
              description: item.offering.description!,
              quantity: item.quantity!,
              price: item.offering.price,
              imageUrl: item.offering.imgS3UrlKeys!,
              dateAdded: item.offering.createdAt!,
              stock: item.offering.stock,
            }));
          return {
            businessId: business.id!,
            businessName: business.name,
            phoneNumber: business.phoneNumber || "",
            address: business.address,
            offerings: offerings,
          };
        });

        setBusinessCart(formattedCart);
        console.log("Formatted Business Cart: ", formattedCart);
      } catch (e) {
        console.log(e);
      }
    };
    fetchBusinesses();
  }, [clientCart]);

  //THIRD useEffect that runs when the orders are modified
  useEffect(() => {
    if (!clientOrders || clientOrders.length === 0) {
      return;
    }
    const fetchBusinesses = async () => {
      //unique business ids
      const businesesIdSet = new Set<string>();
      for (const order of clientOrders) {
        businesesIdSet.add(order.businessId);
      }
      console.log("Order businesesIdSet ", businesesIdSet);

      try {
        const promises: Promise<BusinessModel>[] = Array.from(
          businesesIdSet,
        ).map(async (businessId) => {
          const response: Response = await getBusinessById(businessId);
          if (!response.ok) {
            console.log(response);
          }
          return response.json() as Promise<BusinessModel>;
        });
        const businesses: BusinessModel[] = await Promise.all(promises);
        console.log("Companies ", businesses);

        // Lookup map: businessId -> BusinessModel
        const businessMap = new Map(
          businesses
            .filter((b): b is BusinessModel & { id: string } => !!b.id)
            .map((b) => [b.id, b]),
        );

        // One display entry PER ORDER (not per business)
        const clientOrderList: OrderDisplay[] = clientOrders.map((order) => {
          const business = businessMap.get(order.businessId);

          const offerings = order.items.map((item) => ({
            id: item.offering.id!,
            name: item.offering.name!,
            description: item.offering.description!,
            quantity: item.quantity!,
            price: item.offering.price,
            imageUrl: item.offering.imgS3UrlKeys!,
            dateAdded: item.createdAt!,
            stock: item.offering.stock,
          }));

          return {
            businessId: order.businessId,
            businessName: business?.name ?? "Desconhecido",
            phoneNumber: business?.phoneNumber ?? "",
            totalCost: order.totalCost,
            status: order.status,
            trackId: order.trackId,
            note: order.note ?? "",
            items: offerings,
          };
        });

        setOrderDisplayList(clientOrderList);
        console.log("Formatted Order Display List: ", clientOrderList);
      } catch (e) {
        console.log(e);
      }
    };
    fetchBusinesses();
  }, [clientOrders]);

  const updateQuantity = async (offeringId: string, quantity: number) => {
    console.log(offeringId, quantity);
    const response = await UpdateCartItem(offeringId, quantity);
    if (response.status === 200) {
      setClientCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items
            .map((item) =>
              item.offering.id !== offeringId
                ? item
                : {
                    ...item,
                    quantity: quantity,
                  },
            )
            .filter((item) => item.quantity > 0),
        };
      });

      alert(
        `Quantidade do item no carrinho atualizada com sucesso para: ${quantity}`,
      );

      return;
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
    } else {
      alert(
        "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde ou fique à vontade para relatar o problema na página de consultas.",
      );
      return;
    }
  };

  const cancelOrder = async (trackId: string) => {
    const response: Response = await CancelOrder(trackId);
    if (response.status === 200) {
      window.location.reload();
      alert(`Order sucessfully canceled, we have notified the business`);
      return;
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
      return;
    } else {
      alert("There was an issue with your request");
      return;
    }
  };

  const deleteCartItem = async (offeringId: string) => {
    const response = await DeleteCartItem(offeringId);
    if (response.status === 200) {
      setClientCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.filter((item) => item.offering.id !== offeringId),
        };
      });
      alert(`Item removido do carrinho com sucesso`);
      return;
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
    } else {
      alert(
        "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde ou fique à vontade para relatar o problema na página de consultas.",
      );
      return;
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "cartView":
        return (
          <CartView
            cart={businessCart}
            onDeleteItem={deleteCartItem}
            onUpdateQuantity={updateQuantity}
          />
        );
      case "orderView":
        return <OrderView orders={orderDisplayList} onCancel={cancelOrder} />;
    }
  };

  if (clientCart === null && clientOrders === null) {
    return (
      <>
        <div className="cart-empty-state">
          <i className="bi bi-cart-x"></i>
          <h2>Carrinho não encontrado</h2>
          <p>Inicie sessão para ver e gerir o seu carrinho de compras.</p>
          <Link className="btn-primary-custom" to="/client-login">
            Iniciar Sessão
          </Link>
        </div>
        <GetFooterSection />
      </>
    );
  }
  return (
    <>
      <div className="cart-page">
        <ResponsiveSidebar
          isOpen={sidebar.isOpen}
          isMobile={sidebar.isMobile}
          onOpen={sidebar.open}
          onClose={sidebar.close}
          ariaLabel="Menu do carrinho"
        >
          <ShoppingSidebar
            activeView={activeView}
            onNavigate={(view) => setActiveView(view)}
          />
        </ResponsiveSidebar>

        <main className="cart-main">
          <ShoppingTopBar cart={businessCart} />
          <div className="view active">{renderView()}</div>
        </main>
      </div>
      <GetFooterSection />
    </>
  );
}
export default ShoppingPage;
