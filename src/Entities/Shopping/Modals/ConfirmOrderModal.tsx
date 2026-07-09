import React, { useEffect, useMemo, useState } from "react";
import ImageCarousel from "../../../Components/ImageCarousel";
import { BusinessCart, formatDateTime } from "../types";

interface Props {
  business: BusinessCart;
  onClose: () => void;
  onConfirm: (instructions: string) => void;
}

const ConfirmOrderModal: React.FC<Props> = ({
  business,
  onClose,
  onConfirm,
}) => {
  const [totalPrice, setTotalprice] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  const handleApiCall = () => {
    onConfirm(note);
  };

  const getTotalPrice = () => {
    let total = 0;
    for (const item of business.offerings) {
      total += item.price * item.quantity;
    }
    setTotalprice(Math.trunc(total * 100) / 100);
  };

  useEffect(() => {
    getTotalPrice();
  }, []);

  return (
    <>
      <style>{`
        /* Overlay - fixed position covers entire screen */
        .confirm-order-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 14, 14, 0.8);
          backdrop-filter: blur(4px);
          animation: mfaFade 0.2s ease;
        }

        /* Modal container - scrollable with max height */
        .confirm-order-modal-wrapper {
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          background: var(--cream, #f7f4ef);
          border-top: 4px solid var(--accent, #c8452a);
          font-family: 'DM Sans', sans-serif;
          animation: mfaSlideIn 0.3s ease-out;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Modal body - scrollable content */
        .confirm-order-modal-body {
          overflow-y: auto;
          padding: 0;
          flex: 1;
        }

        /* Header - fixed/sticky at top */
        .confirm-order-modal-header {
          padding: 1.5rem 2rem;
          background: var(--ink, #0f0e0e);
          color: var(--cream, #f7f4ef);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .confirm-order-modal-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          margin: 0;
          font-weight: 900;
        }

        .confirm-order-modal-close {
          background: transparent;
          border: none;
          color: var(--cream, #f7f4ef);
          font-size: 2rem;
          line-height: 1;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
        }

        .confirm-order-modal-close:hover {
          color: var(--accent, #c8452a);
        }

        /* All your existing styles scoped under .confirm-order-modal */
        .confirm-order-modal.cart-company {
          background: transparent;
          border: none;
          border-top: none;
          margin-bottom: 0;
          font-family: 'DM Sans', sans-serif;
          padding: 1.5rem 2rem;
        }

        .confirm-order-modal .cart-company-head {
          padding: 0;
          background: transparent;
          border-bottom: none;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .confirm-order-modal .cart-company-identity {
          width: 100%;
        }

        .confirm-order-modal .cart-company-icon {
          background: var(--accent, #c8452a);
          color: var(--cream, #f7f4ef);
        }

        .confirm-order-modal .cart-company-name {
          color: var(--ink, #0f0e0e);
          font-weight: 900;
          font-size: 1.1rem;
        }

        .confirm-order-modal .cart-company-meta {
          color: var(--mid, #5a5650);
          font-size: 0.8rem;
        }

        .confirm-order-modal .btn-checkout {
          background: var(--accent, #c8452a);
          border: none;
          color: var(--cream, #f7f4ef);
          padding: 0.8rem 1.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          width: 100%;
        }

        .confirm-order-modal .btn-checkout:hover {
          background: var(--ink, #0f0e0e);
          transform: translateY(-1px);
        }

        .confirm-order-modal .btn-checkout i {
          transition: transform 0.2s;
        }

        .confirm-order-modal .btn-checkout:hover i {
          transform: translateX(3px);
        }

        .confirm-order-modal .cart-products {
          padding: 0;
          margin-top: 1.5rem;
          gap: 1rem;
        }

        .confirm-order-modal .cart-product {
          display: flex;
          gap: 1.25rem;
          padding: 1rem;
          background: #fff;
          border: 1px solid #e0d8d0;
          margin-bottom: 0.75rem;
          transition: border-color 0.2s;
        }

        .confirm-order-modal .cart-product:hover {
          border-color: var(--accent, #c8452a);
        }

        .confirm-order-modal .cart-product-thumb {
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }

        .confirm-order-modal .cart-product-thumb .carousel-container {
          width: 100%;
          height: 100%;
        }

        .confirm-order-modal .cart-product-info {
          flex: 1;
          min-width: 0;
        }

        .confirm-order-modal .cart-product-date {
          font-size: 0.7rem;
          color: var(--mid, #5a5650);
          margin-bottom: 0.3rem;
        }

        .confirm-order-modal .cart-product-name {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 0.2rem 0;
        }

        .confirm-order-modal .cart-product-price {
          font-family: 'DM Mono', 'JetBrains Mono', ui-monospace, monospace;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--accent, #c8452a);
          margin: 0 0 0.3rem 0;
        }

        .confirm-order-modal .cart-product-desc {
          font-size: 0.8rem;
          color: var(--mid, #5a5650);
          margin: 0;
          line-height: 1.4;
        }

        .confirm-order-modal .cart-product-actions {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding-left: 1.25rem;
          border-left: 1px solid #e0d8d0;
          min-width: 80px;
        }

        .confirm-order-modal .cart-product-actions span {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--mid, #5a5650);
        }

        .confirm-order-modal .cart-product-actions label {
          font-family: 'DM Mono', 'JetBrains Mono', ui-monospace, monospace;
          font-size: 1.5rem;
          font-weight: 500;
          color: var(--ink, #0f0e0e);
        }

        .confirm-order-modal .order-instructions {
          width: 100%;
          box-sizing: border-box;
          padding: 0.9rem;
          background: #fff;
          border: 1px solid #e0d8d0;
          border-radius: 0;
          outline: none;
          resize: vertical;
          min-height: 80px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--ink, #0f0e0e);
          transition: border-color 0.2s;
          margin-top: 0.5rem;
        }

        .confirm-order-modal .order-instructions::placeholder {
          color: #c9c4bc;
        }

        .confirm-order-modal .order-instructions:focus {
          border-color: var(--accent, #c8452a);
        }

        /* Footer buttons */
        .confirm-order-modal-footer {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e0d8d0;
          background: var(--cream, #f7f4ef);
          flex-shrink: 0;
        }

        .confirm-order-modal-footer .btn-cancel {
          flex: 1;
          background: transparent;
          border: 1px solid #ddd;
          padding: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--mid, #5a5650);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .confirm-order-modal-footer .btn-cancel:hover {
          border-color: #aaa;
          color: var(--ink, #0f0e0e);
        }

        .confirm-order-modal-footer .btn-confirm {
          flex: 2;
          background: var(--ink, #0f0e0e);
          color: var(--cream, #f7f4ef);
          border: none;
          padding: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
        }

        .confirm-order-modal-footer .btn-confirm:hover {
          background: var(--accent, #c8452a);
        }

        /* Animations */
        @keyframes mfaFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes mfaSlideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .confirm-order-overlay,
          .confirm-order-modal-wrapper {
            animation: none;
          }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .confirm-order-modal-header {
            padding: 1.25rem 1.5rem;
          }

          .confirm-order-modal.cart-company {
            padding: 1.5rem;
          }

          .confirm-order-modal .cart-product {
            flex-direction: column;
          }

          .confirm-order-modal .cart-product-thumb {
            width: 100%;
            height: 150px;
          }

          .confirm-order-modal .cart-product-actions {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding-left: 0;
            border-left: none;
            border-top: 1px solid #e0d8d0;
            padding-top: 0.75rem;
            min-width: unset;
          }

          .confirm-order-modal-footer {
            flex-direction: column;
            padding: 1.25rem 1.5rem;
          }
        }
      `}</style>

      {/* Overlay - click on it to close */}
      <div className="confirm-order-overlay" onClick={onClose}>
        {/* Modal wrapper - stop propagation so clicks inside don't close */}
        <div
          className="confirm-order-modal-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="confirm-order-modal-header">
            <h2>Confirmar Encomenda</h2>
            <button className="confirm-order-modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          {/* Body */}
          <div className="confirm-order-modal-body">
            <section className="confirm-order-modal cart-company">
              <div className="cart-company-head">
                <div className="cart-company-identity">
                  <div className="cart-company-icon">
                    <i className="bi bi-shop"></i>
                  </div>
                  <div>
                    <h2 className="cart-company-name">
                      {business.businessName}
                    </h2>
                    <div className="cart-company-meta">
                      <span>
                        <i className="bi bi-telephone"></i>{" "}
                        {business.phoneNumber}
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
              </div>

              <div className="cart-products">
                {business.offerings.map((offering) => (
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
                      <h3 className="cart-product-price">$ {offering.price}</h3>
                      <p className="cart-product-desc">
                        {offering.description}
                      </p>
                    </div>

                    <div className="cart-product-actions">
                      <span>Quantidade</span>
                      <label htmlFor="">{offering.quantity}</label>
                    </div>
                  </article>
                ))}
                <h5> Preço final: {totalPrice}</h5>
                <textarea
                  value={note}
                  onChange={handleInputChange}
                  className="order-instructions"
                  placeholder="Instruções para a encomenda (opcional)…"
                ></textarea>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="confirm-order-modal-footer">
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-confirm" onClick={handleApiCall}>
              Confirmar Encomenda
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrderModal;
