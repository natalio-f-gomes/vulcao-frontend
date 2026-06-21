import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem, CompanyModel, PlaceOrderModel, ProductModel, UserProfileModel, WearableModel } from "../../api/interfaces";
import { getProductById, getWearableById, placeOrder, removeItemFromCart } from "../../api/requests";
import { imageUrlFromKey } from "../../components/ImageCarousel";




interface CartViewProps {
  company: CompanyModel;
  currentUser: UserProfileModel | null;
  cartItems: CartItem[];
}

export default function CartView({ company, currentUser, cartItems }: CartViewProps) {
  const navigate = useNavigate();
  const [productList, setProductList] = useState<ProductModel[]>([]);
  const [wearableList, setWearableList] = useState<WearableModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [order,setOrder]= useState<PlaceOrderModel>({
      userId: "",
      cartItems: [],
      status: "SENT",
      totalCost: 0,
      trackId: "",
      companyId: "",
      note: ""
  });
  
  // We use this to track exactly WHICH item is currently being deleted
  const [productIdToBeDeleted, setProductIdToBeDeleted] = useState<string | null>(null);

  const placeOrderRequest =  async () => {
      if(order === null && productList === null && wearableList === null){
          alert("O seu carrinho está vazio!");
          return;
      }
    

      const response = await placeOrder(order);
      console.log("RESPOSTA AO COLOCAR ENCOMENDA: ", response);
      if(!response.ok){
          console.log("Ocorreu um problema com o seu pedido");
          return;
      }
      if(response.status === 201){
          alert("Encomenda realizada com sucesso. Enviamos email de confirmacao para o seu email no sistema");
          return;
      }

  }

  useEffect(() => {
    const loadCartItems = async () => {
      if (cartItems.length === 0) {
        setProductList([]);
        setWearableList([])
        return;
      }
      setLoading(true);
      try {
       const responses = await Promise.all(
        cartItems.map((item) => {
        if (item.itemType === "PRODUCT")  return getProductById(item.id!);
        if (item.itemType === "WEARABLE") return getWearableById(item.id!);
        return undefined;
  })
);

const products: ProductModel[] = [];
const wearables: WearableModel[] = [];

for (let i = 0; i < responses.length; i++) {
  const res = responses[i];
  const item = cartItems[i];            // same index → same item
  if (!res || !res.ok) {
    console.log("There was an issue loading one of the cart items");
    continue;
  }
  const data = await res.json();        // a single ProductModel / WearableModel
  if (item.itemType === "PRODUCT") {
    products.push(data as ProductModel);
  } else if (item.itemType === "WEARABLE") {
    wearables.push(data as WearableModel);
  }
}

setProductList(products);
setWearableList(wearables);
      } catch (err) {
        console.error("There was an issue loading cart products:", err);
      } finally {
        setLoading(false);
        if(company.id && currentUser?.id && cartItems){
          setOrder({...order, companyId: company.id, userId: currentUser.id, cartItems: cartItems, totalCost: 0})
        }
      }
    };

    loadCartItems();
  }, [cartItems]);

 const totalPrice = useMemo(() => {
  const productTotal = productList.reduce((sum, product) => {
    const quantity = cartItems.find((item) => item.id === product.id)?.quantity ?? 0;
    return sum + product.pricePerUnit * quantity;
  }, 0);

  const wearableTotal = wearableList.reduce((sum, wearable) => {
    const quantity = cartItems.find((item) => item.id === wearable.id)?.quantity ?? 0;
    return sum + wearable.price * quantity;
  }, 0);

  return productTotal + wearableTotal;
}, [productList, wearableList, cartItems]);

  const quantityFor = (productId?: string) =>
    cartItems.find((ci) => ci.id === productId)?.quantity ?? 0;

  const currencySymbol = productList[0]?.currency || "";

  const removeItemsFromCart = async (itemId?: string) => {
    if (itemId && company.id) {
        // Set the specific ID being deleted instead of global loading flag
        setProductIdToBeDeleted(itemId);
        try {
          const response = await removeItemFromCart(itemId, company.id);
          console.log("delete item from cart response ", response);
          
            if (!response.ok) {
              alert("Ocorreu um problema com o seu pedido");
              return;
          }

          if (response.status === 200) {
              alert("Produto removido do carrinho do utilizador com sucesso");

            // Optimistically update local state so it vanishes immediately 
            setProductList(prev => prev.filter(product => product.id !== itemId));
          }
        } catch (error) {
          console.error("Failed to delete item:", error);
        } finally {
          // Clear the target delete state
          setProductIdToBeDeleted(null);
        }
    }
  };

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const fieldName = e.target.id as keyof PlaceOrderModel; // not keyof FormData
      setOrder((prev) => ({ ...prev, [fieldName]: e.target.value }));
    };
  

  if (!currentUser) {
    return (
      <div style={{ padding: "3rem 2.5rem", textAlign: "center", color: "var(--mid)" }}>
        <p style={{ marginBottom: "1.25rem" }}>Inicie sessão para ver o seu carrinho da empresa '{company.name}'.</p>
        <button className="btn-primary-custom" onClick={() => navigate("/user-login")}>Sign in</button>
      </div>
    );
  }

  return (
    <section style={{ padding: "2.5rem" }}>
      <style>{`
        .cart-checkout-bar {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          padding: 16px 20px;
        }
        .cart-checkout-bar .cart-total {
          font-weight: bold;
          font-size: 1.1rem;
        }
        .cart-checkout-bar .cart-checkout-btn {
          margin: 0;
          width: 100%;
        }
        @media (min-width: 992px) {
          .cart-checkout-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .cart-checkout-bar .cart-total { white-space: nowrap; }
          .cart-checkout-bar .cart-checkout-btn { width: auto; white-space: nowrap; }
        }
        .spinner-mini {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #dc3545;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="section-header"><h2 className="section-title">Meu carrinho</h2></div>

      {loading ? (
        <p style={{ color: "var(--mid)" }}>Carregando o seu carrinho</p>
      ) : productList.length === 0 && wearableList.length === 0 ? (
        <p style={{ color: "var(--mid)" }}>Seu carrinho da empresa {company.name} está vazio.</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e8e4de" }}>

          {/* Products */}
          {productList.map((product) => {
            const isDeletingThisItem = productIdToBeDeleted === product.id;

            return (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 20px",
                  borderBottom: "1px solid #f0ece6",
                  opacity: isDeletingThisItem ? 0.5 : 1, // Visual cue that item is on its way out
                  transition: "opacity 0.2s"
                }}
              >
                {/* Product Image */}
                <div style={{ width: 56, height: 56, background: "#f0ece6", flexShrink: 0, overflow: "hidden" }}>
                  {product.imgS3UrlKeys?.[0] ? (
                    <img src={imageUrlFromKey(product.imgS3UrlKeys[0])} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="bi bi-box-seam" style={{ fontSize: "1.4rem", color: "#aaa", margin: 16 }} />
                  )}
                </div>

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{product.name}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--mid)" }}>
                    {product.pricePerUnit} {product.currency} × {quantityFor(product.id)}
                  </div>
                </div>

                {/* Inline Delete Button / Loading Loader */}
                <div>
                  <button
                    type="button"
                    disabled={isDeletingThisItem} // Prevent double clicking
                    onClick={() => removeItemsFromCart(product.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc3545",
                      cursor: isDeletingThisItem ? "not-allowed" : "pointer",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      transition: "background-color 0.2s",
                      minWidth: "34px",
                      minHeight: "34px"
                    }}
                    onMouseEnter={(e) => !isDeletingThisItem && (e.currentTarget.style.backgroundColor = "#fff5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    title="Remove item"
                  >
                    {isDeletingThisItem ? (
                      <div className="spinner-mini" />
                    ) : (
                      <i className="bi bi-trash" style={{ fontSize: "1.2rem" }} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Wearables */}
          {wearableList.map((item) => {
            const isDeletingThisItem = productIdToBeDeleted === item.id;

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 20px",
                  borderBottom: "1px solid #f0ece6",
                  opacity: isDeletingThisItem ? 0.5 : 1, // Visual cue that item is on its way out
                  transition: "opacity 0.2s"
                }}
              >
                {/* Wearable Image */}
                <div style={{ width: 56, height: 56, background: "#f0ece6", flexShrink: 0, overflow: "hidden" }}>
                  {item.imgS3UrlKeys?.[0] ? (
                    <img src={imageUrlFromKey(item.imgS3UrlKeys[0])} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="bi bi-box-seam" style={{ fontSize: "1.4rem", color: "#aaa", margin: 16 }} />
                  )}
                </div>

                {/* Wearable Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--mid)" }}>
                    {item.price} {item.currency} × {quantityFor(item.id)}
                  </div>
                </div>

                {/* Inline Delete Button / Loading Loader */}
                <div>
                  <button
                    type="button"
                    disabled={isDeletingThisItem} // Prevent double clicking
                    onClick={() => removeItemsFromCart(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc3545",
                      cursor: isDeletingThisItem ? "not-allowed" : "pointer",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      transition: "background-color 0.2s",
                      minWidth: "34px",
                      minHeight: "34px"
                    }}
                    onMouseEnter={(e) => !isDeletingThisItem && (e.currentTarget.style.backgroundColor = "#fff5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    title="Remove item"
                  >
                    {isDeletingThisItem ? (
                      <div className="spinner-mini" />
                    ) : (
                      <i className="bi bi-trash" style={{ fontSize: "1.2rem" }} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Order note */}
          <div style={{ margin: "12px", width: "calc(100% - 24px)" }}>
            <textarea
              id="note"
              name="note"
              placeholder="Adicione instruções ao seu pedido..."
              onChange={handleInputChange}
              maxLength={5000}
              style={{
                width: "100%",
                minHeight: "140px",
                padding: "12px",
                border: "1px solid #d8d3cc",
                borderRadius: "4px",
                resize: "vertical",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                lineHeight: "1.5",
                boxSizing: "border-box",
                backgroundColor: "#fff"
              }}
            />
            <div style={{ textAlign: "right", fontSize: "0.75rem", color: "#888", marginTop: "4px" }}>
              Maximum 5000 characters
            </div>
          </div>

          {/* Stacks on small/medium (button at the bottom), row on large */}
          <div className="cart-checkout-bar">
            <div className="cart-total">
              Total: {totalPrice.toFixed(2)} {currencySymbol}
            </div>
            <button
              className="btn-primary-custom cart-checkout-btn"
              onClick={() => placeOrderRequest()}
            >
              Place Order
            </button>
          </div>

        </div>
      )}
    </section>
  );

}