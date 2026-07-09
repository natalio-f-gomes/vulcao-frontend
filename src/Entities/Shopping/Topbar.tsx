import React from "react";
import { BusinessCart } from "./types";

interface Props {
  cart: BusinessCart[];
}

const ShoppingTopBar: React.FC<Props> = ({ cart }) => {
  const totalItems = cart.reduce(
    (sum, c) => sum + c.offerings.reduce((s, p) => s + p.quantity, 0),
    0,
  );
  localStorage.setItem("cartItemsQuantity", totalItems.toString());

  return (
    <div className="page-header">
      <div className="page-eyebrow">Compras</div>
      <h1 className="page-title">O Meu Carrinho</h1>
      <p className="cart-subtitle">
        {totalItems} {totalItems === 1 ? "artigo" : "artigos"} de {cart.length}{" "}
        {cart.length === 1 ? "negocio" : "negocios"}
      </p>
    </div>
  );
};

export default ShoppingTopBar;
