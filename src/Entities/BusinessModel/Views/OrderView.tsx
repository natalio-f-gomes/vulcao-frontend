import BusinessOrderCard from "./Cards/BusinessOrderCard";
import { ClientOrderDisplay } from "./types";

interface Props {
  orderList: ClientOrderDisplay[];
}

function OrderView({ orderList }: Props) {
  if (orderList.length === 0) {
    return (
      <div className="cart-empty-inline">
        <i className="bi bi-inbox"></i>
        <p>Não existem encomendas de clientes neste momento!</p>
      </div>
    );
  }

  return (
    <>
      {orderList.map((displayOrder) => (
        <BusinessOrderCard
          key={displayOrder.order.trackId}
          order={displayOrder.order}
          client={displayOrder.client}
        />
      ))}
    </>
  );
}

export default OrderView;
