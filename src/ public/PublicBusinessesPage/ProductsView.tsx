import { useState } from "react";
import { CompanyModel, ProductModel, UserProfileModel } from "../../api/interfaces";
import { useNavigate } from "react-router-dom";
import { addProductToCart } from "../../api/requests";
import { imageUrlFromKey } from "../../components/ImageCarousel";
import ViewProductModal from "../../entities/company/modals/products/ViewProductModal";

interface ProductsViewProps {
  products: ProductModel[];
  user: UserProfileModel | null;
  company: CompanyModel | null;
  onLoadCart: () => void;
}


type ProductQuantities = Record<string, number>;

export default function ProductsView({ products, user, company, onLoadCart }: ProductsViewProps) {
  // Initialize state as an empty object targeting product IDs
  const [quantities, setQuantities] = useState<ProductQuantities>({});
  const [productToView, setProductToView] = useState<ProductModel|null>(null);
  const navigate = useNavigate();

  const minOfferingQuantity = 1;
  const maxOfferingQuantity = 10;
  const numberRange: number[] = [];
  for (let i = minOfferingQuantity; i <= maxOfferingQuantity; i++) {
    numberRange.push(i);
  }

  const handleAddItemToCart = async (product: ProductModel) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      navigate("/user-login");
      return;
    }
    if (!company || !company.id) {
      alert("There are no companies with this id");
      navigate("/");
      return;
    }
    if (!product.id) return;


    const selectedQuantity = quantities[product.id] || 1;

    try {
      const response = await addProductToCart(product.id, selectedQuantity, company.id);
      console.log("RESPONSE ADDING ITEM TO CART: ", response);
      if (response.ok) {
        alert("Product added to cart!");
        onLoadCart(); 
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  return (
    <>
    <section className="products-section" style={{ padding: "2.5rem" }}>
      <div className="section-header">
        <h2 className="section-title">Our Products</h2>
      </div>

      {products.length === 0 ? (
        <p style={{ color: "var(--mid)" }}>This business has no products listed yet.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const s3ImgKey = product.imgS3UrlKeys?.[0];
            const inStock = product.stock > 0;
            // Get current quantity for this specific product or default to 1
            const currentQuantity = product.id ? quantities[product.id] || 1 : 1;

            return (
              <div className="product-card" key={product.id}>
                <div className="product-thumb">
                  {s3ImgKey ? (
                    <img src={imageUrlFromKey(s3ImgKey)} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="bi bi-box-seam"></i>
                  )}
                  {!inStock && <span className="product-badge" style={{ background: "#888" }}>Out of stock</span>}
                </div>

                <div className="product-info">
                  <div className="product-category">{product.productType?.replaceAll("_", " ")}</div>
                  <div className="product-name">{product.name}</div>

                  <div
                    className="product-footer"
                    style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", width: "100%" }}
                  >
                    <span className="product-price">
                      ${product.pricePerUnit} {product.currency} / {product.unitType}
                    </span>

                    <div
                      className="product-actions"
                      style={{ 
                        display: "flex", 
                        alignItems: "stretch", 
                        gap: "3px", 
                        width: "100%",
                        flexWrap: "nowrap" 
                      }}
                    >
                      <select
                        value={currentQuantity}
                        onChange={(e) => {
                          if (product.id) {
                            handleQuantityChange(product.id, Number(e.target.value));
                          }
                        }}
                        disabled={!inStock}
                        aria-label="Quantity"
                        style={{ 
                          padding: "0.3rem 0.4rem", 
                          borderRadius: 6, 
                          border: "1px solid #d8d2c8", 
                          background: "#fff",
                          flexShrink: 0,
                          marginLeft:'-5px'
                        }}
                      >
                        {numberRange.map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>

                      <button
                        className="btn-primary-custom"
                        disabled={!inStock}
                        style={{
                          whiteSpace: "nowrap",
                          flexGrow: 2,
                          padding: "0.4rem 0.6rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          fontSize: "0.9rem",
                          cursor: !inStock ? "not-allowed" : "pointer",
                          background: !inStock ? "#ccc" : undefined
                        }}
                        onClick={() => handleAddItemToCart(product)}
                      >
                        <i className="bi bi-bag-plus" /> Add
                      </button>
                      
                      <button 
                        className="btn-primary-custom"
                        style={{
                          whiteSpace: "nowrap",
                          flexGrow: 1,
                          padding: "0.4rem 0.6rem",
                          fontSize: "0.9rem",
                          cursor: "pointer"
                        }}
                        onClick={() => setProductToView(product)} 
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
    {productToView && (
      <ViewProductModal 
        isOpen={productToView!== null}
        productToView={productToView}
        onClose={()=>setProductToView(null)}
      />
    )}
    </>
  );
}