import { ChangeEvent, useState } from "react";
import ImageCarousel from "../../../../Components/imageCarousel";
import { ProfileModel } from "../../../../Interfaces/Authentication";
import {
  OrderModel,
  OrderStatus,
  OrderStatusList,
} from "../../../../Interfaces/global";
import { BusinessUpdateOrderStatus } from "../../../../Requests/shopping";

interface Props {
  order: OrderModel;
  client: ProfileModel;
}
const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "RECEBIDO":
      return "bg-primary text-white border-primary"; // Blue
    case "PROCESSANDO":
      return "bg-warning text-dark border-warning"; // Yellow (Warning uses dark text for contrast)
    case "ENVIADO":
      return "bg-info text-dark border-info"; // Cyan/Teal
    case "CONCLUÍDO":
      return "bg-success text-white border-success"; // Green
    case "CANCELADO":
      return "bg-danger text-white border-danger"; // Red
    case "PENDENTE":
      return "bg-secondary text-white border-secondary"; // Gray
    default:
      return "bg-light text-dark border-dark";
  }
};

function BusinessOrderCard({ order, client }: Props) {
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as OrderStatus;
    setOrderStatus(newStatus);
    onUpdateStatus(order.trackId, newStatus);
  };

  const onUpdateStatus = async (trackId: string, status: OrderStatus) => {
    const response = await BusinessUpdateOrderStatus(trackId, status);
    if (response.ok) {
      alert(
        "Estado da encomenda atualizado com sucesso! Tanto o cliente como o(a) empresário(a) foram notificados",
      );
      return;
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
    } else {
      alert("Ocorreu um problema inesperado!");
      console.log(response);
      return;
    }
  };
  const statusClass = `order-status order-status--${orderStatus.toLowerCase()}`;

  return (
    <section className="cart-company order-card">
      {/* ---------- Header: client details ---------- */}
      <div className="cart-company-head">
        <div className="cart-company-identity">
          <div className="cart-company-icon">
            <i className="bi bi-person"></i>
          </div>
          <div>
            <h2 className="cart-company-name">
              {client.firstName} {client.lastName}
            </h2>
            <div className="cart-company-meta">
              <span>
                <i className="bi bi-envelope"></i> {client.email}
              </span>
              {client.phoneNumber && (
                <span>
                  <i className="bi bi-telephone"></i> {client.phoneNumber}
                </span>
              )}
              <span title="Morada de entrega">
                <i className="bi bi-geo-alt"></i> Address:{" "}
                {!client.address ? (
                  "Não defenido"
                ) : typeof client.address === "string" ? (
                  client.address
                ) : (
                  <>
                    {client.address.country?.replaceAll("_", " ") ?? ""}{" "}
                    {client.address.state ?? ""} {client.address.city ?? ""}{" "}
                    {client.address.zone ?? ""} {client.address.street ?? ""}{" "}
                    {client.address.postalCode ?? ""}
                  </>
                )}
              </span>

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
        <div className={`order-head-actions`}>
          <select
            name="status"
            className={`form-select ${statusClass} ${getStatusColor(orderStatus)}`}
            id="status"
            onChange={handleChange}
            value={orderStatus}
            style={{ maxWidth: "155px", fontSize: "14px" }}
          >
            {OrderStatusList.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- Items ---------- */}
      <div className="cart-products">
        {order.items.map((offering) => (
          <article className="cart-product" key={offering.offering.id}>
            <div className="cart-product-thumb">
              <div className="carousel-container">
                <ImageCarousel
                  imageKeys={offering.offering.imgS3UrlKeys}
                  width={"100%"}
                  height={150}
                  altText={offering.offering.name}
                />
              </div>
            </div>
            <div className="cart-product-info">
              {/* <div className="cart-product-date">
                Adicionado a {formatDate(offering.createdAt!)}
              </div> */}
              <h3 className="cart-product-name">{offering.offering.name}</h3>
              <p className="cart-product-desc">
                {offering.offering.description}
              </p>
            </div>
            <div className="cart-product-actions order-item-summary">
              <div className="order-item-line">
                <span>Preço unitário</span>
                <strong>$ {offering.offering.price.toFixed(2)}</strong>
              </div>
              <div className="order-item-line">
                <span>Quantidade</span>
                <strong>{offering.quantity}</strong>
              </div>
              <div className="order-item-line order-item-subtotal">
                <span>Subtotal</span>
                <strong>
                  $ {(offering.offering.price * offering.quantity).toFixed(2)}
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
            <span>
              Instruções: {order.note ?? "O cliente não deixou instruções"}
            </span>
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

export default BusinessOrderCard;
