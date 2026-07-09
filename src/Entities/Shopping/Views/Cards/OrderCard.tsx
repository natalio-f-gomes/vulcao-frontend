import { formatDateTime, OrderDisplay } from "../../types";
import ImageCarousel from "../../../../Components/ImageCarousel";
import { CancelOrder } from "../../../../Requests/shopping";

interface Props {
  order: OrderDisplay;
  onCancel: (trackId: string) => void;
}

// Map status -> label + css modifier (adjust to your real statuses)
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  SHIPPED: "Enviada",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelada",
  UNKNOWN: "Desconhecido",
};

function OrderCard({ order, onCancel }: Props) {
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;
  const statusClass = `order-status order-status--${order.status.toLowerCase()}`;

  const onCancelOrder = async () => {
    onCancel(order.trackId);
  };

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <section className="cart-company order-card">
      {/* ---------- Header ---------- */}
      <div className="cart-company-head">
        <div className="cart-company-identity">
          <div className="cart-company-icon">
            <i className="bi bi-shop"></i>
          </div>
          <div>
            <h2 className="cart-company-name">{order.businessName}</h2>
            <div className="cart-company-meta">
              {order.phoneNumber && (
                <span>
                  <i className="bi bi-telephone"></i> {order.phoneNumber}
                </span>
              )}
              {order.trackId && (
                <span title="Código de rastreio">
                  <i className="bi bi-upc-scan"></i> {order.trackId}
                </span>
              )}
              <span>
                <i className="bi bi-box-seam"></i> {itemCount}{" "}
                {itemCount === 1 ? "artigo" : "artigos"}
              </span>
            </div>
          </div>
        </div>
        <div className="order-head-actions">
          {order.status !== "CANCELADO" && (
            <button
              type="button"
              className="btn-cancel-order"
              onClick={() => onCancelOrder()}
            >
              <i className="bi bi-x-circle"></i> Cancelar
            </button>
          )}
          <span className={statusClass}>{statusLabel}</span>
        </div>
      </div>

      {/* ---------- Items ---------- */}
      <div className="cart-products">
        {order.items.map((offering) => (
          <article className="cart-product" key={offering.id}>
            <div className="cart-product-thumb">
              <div className="carousel-container">
                <ImageCarousel
                  imageKeys={offering.imageUrl}
                  width={"100%"}
                  height={150}
                  altText={offering.name}
                />
              </div>
            </div>
            <div className="cart-product-info">
              <div className="cart-product-date">
                Adicionado a {formatDateTime(offering.dateAdded)}
              </div>
              <h3 className="cart-product-name">{offering.name}</h3>
              <p className="cart-product-desc">{offering.description}</p>
            </div>
            <div className="cart-product-actions order-item-summary">
              <div className="order-item-line">
                <span>Preço unitário</span>
                <strong>$ {offering.price.toFixed(2)}</strong>
              </div>
              <div className="order-item-line">
                <span>Quantidade</span>
                <strong>{offering.quantity}</strong>
              </div>
              <div className="order-item-line order-item-subtotal">
                <span>Subtotal</span>
                <strong>
                  $ {(offering.price * offering.quantity).toFixed(2)}
                </strong>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ---------- Footer: note + total ---------- */}
      <div className="order-card-footer">
        {order.note ? (
          <div className="order-note">
            <i className="bi bi-chat-left-text"></i>
            <span>{order.note}</span>
          </div>
        ) : (
          <div />
        )}
        <div className="order-total">
          <span>Total da encomenda</span>
          <strong>$ {order.totalCost.toFixed(2)}</strong>
        </div>
      </div>
    </section>
  );
}

export default OrderCard;
