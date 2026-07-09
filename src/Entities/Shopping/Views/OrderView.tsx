import { Link } from "react-router-dom";
import { OrderDisplay } from "../types";
import OrderCard from "./Cards/OrderCard";

interface Props {
  orders: OrderDisplay[];
  onCancel: (trackId: string) => void;
}

function OrderView({ orders, onCancel }: Props) {
  if (orders.length === 0) {
    return (
      <div className="cart-empty-inline">
        <i className="bi bi-cart"></i>
        <p>Não tem nenhuma encomenda neste momento!</p>
        <Link className="btn-outline-custom" to="/">
          Continuar a Comprar
        </Link>
      </div>
    );
  }
  return (
    <>
      {orders.map((order) => (
        <OrderCard key={order.trackId} order={order} onCancel={onCancel} />
      ))}
    </>
  );
}

export default OrderView;
