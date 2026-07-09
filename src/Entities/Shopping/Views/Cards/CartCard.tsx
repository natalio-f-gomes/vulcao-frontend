import { useState } from "react";
import { BusinessCart, formatDateTime } from "../../types";
import { OrderRequest } from "../../../../Interfaces/global";
import { PlaceOrder } from "../../../../Requests/shopping";
import ImageCarousel from "../../../../Components/imageCarousel";
import ConfirmOrderModal from "../../Modals/ConfirmOrderModal";

interface Props {
  business: BusinessCart;
  onUpdateQuantity: (offeringId: string, quantity: number) => void;
  onDeleteItem: (offeringId: string) => void;
}

function CartCard({ business, onUpdateQuantity, onDeleteItem }: Props) {
  const [checkoutItems, setCheckoutItems] = useState<BusinessCart | null>(null);
  const handleClose = () => {
    setCheckoutItems(null);
  };

  const handleConfirm = async (instructions: string) => {
    if (!checkoutItems) {
      return;
    }

    const items = checkoutItems.offerings.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      name: item.name,
      businessId: checkoutItems.businessId,
    }));

    console.log("Items to send:", items);
    console.log("checkoutItems:", checkoutItems);

    console.log(instructions);
    const orderRequest: OrderRequest = {
      note: instructions,
      items: items,
    };

    console.log("orderRequest: ", orderRequest);
    const response = await PlaceOrder(checkoutItems.businessId, orderRequest);
    if (response.ok) {
      alert(
        "Encomenda efetuada com sucesso! Enviámos um e-mail para si e para a empresa: " +
          checkoutItems.businessName,
      );
      setCheckoutItems(null); // Close modal after confirmation
      window.location.reload();
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
    } else {
      alert(
        "Ocorreu um problema com o seu pedido. Por favor, tente mais tarde ou reporte o problema.",
      );
      console.log("There was an issue with your request: ", response);
    }
  };

  return (
    <>
      {" "}
      <section className="cart-company">
        <div className="cart-company-head">
          <div className="cart-company-identity">
            <div className="cart-company-icon">
              <i className="bi bi-shop"></i>
            </div>
            <div>
              <h2 className="cart-company-name">{business.businessName}</h2>
              <div className="cart-company-meta">
                <span>
                  <i className="bi bi-telephone"></i> {business.phoneNumber}
                </span>
                <span>
                  <i className="bi bi-geo-alt"></i>{" "}
                  {business.address.country.replaceAll("_", " ")} -{" "}
                  {business.address.island} - {business.address.city} -{" "}
                  {business.address.zone}- {business.address.postalCode}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-checkout"
            onClick={() => setCheckoutItems(business)}
          >
            Finalizar Compra <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="cart-products">
          {business.offerings.map((offering) => (
            <article className="cart-product" key={offering.id}>
              <div className="cart-product-thumb">
                <div className="carousel-container">
                  <ImageCarousel
                    imageKeys={offering.imageUrl}
                    width={"100%"}
                    height={150} // Change from 150 to 100% to follow container dimensions
                    altText={offering.name}
                  />
                </div>
              </div>

              <div className="cart-product-info">
                <div className="cart-product-date">
                  Adicionado a {formatDateTime(offering.dateAdded)}
                </div>
                <h3 className="cart-product-name">{offering.name}</h3>
                <h3 className="cart-product-price">$ {offering.price}</h3>
                <p className="cart-product-desc">{offering.description}</p>
              </div>

              <div className="cart-product-actions">
                <span>Quantidade</span>
                <div className="qty-control">
                  <label
                    htmlFor={`qty-select-${offering.id}`}
                    className="visually-hidden"
                  ></label>
                  <select
                    id={`qty-select-${offering.id}`}
                    className="dropdown"
                    value={offering.quantity}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value, 10);
                      // Pass the explicit new total quantity to your handler
                      onUpdateQuantity(offering.id, newQty);
                    }}
                  >
                    {[...Array(10)].map((_, index) => {
                      const value = index + 1;
                      return (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => onDeleteItem(offering.id)}
                >
                  <i className="bi bi-trash"></i> Remover
                </button>
              </div>
            </article>
          ))}
        </div>
        {checkoutItems && (
          <ConfirmOrderModal
            business={checkoutItems}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        )}
      </section>
    </>
  );
}

export default CartCard;
