import { Link } from "react-router-dom";
import { BusinessCart } from "../types";
import CartCard from "./Cards/CartCard";

interface Props {
  cart: BusinessCart[];
  onUpdateQuantity: (offeringId: string, quantity: number) => void;
  onDeleteItem: (offeringId: string) => void;
}

function CartView({ cart, onUpdateQuantity, onDeleteItem }: Props) {
  if (cart.length === 0) {
    return (
      <div className="cart-empty-inline">
        <i className="bi bi-cart"></i>
        <p>O seu carrinho está vazio.</p>
        <Link className="btn-outline-custom" to="/">
          Continuar a Comprar
        </Link>
      </div>
    );
  }
  return (
    <>
      {cart.map((business) => (
        <CartCard
          key={business.businessId}
          business={business}
          onUpdateQuantity={onUpdateQuantity}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </>
  );
}

export default CartView;
