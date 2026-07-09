import { useEffect, useState } from "react";
import { ProductModel } from "../Interfaces/offerings";
import { ProfileModel } from "../Interfaces/Authentication";
import { getUserProfileData } from "../Requests/client";
import { getAllProducts } from "../Requests/offerings";
import ImageCarousel from "./imageCarousel";
import { AddToCart } from "../Requests/shopping";

function GetOfferingSection() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [currentUser, setCurrentUser] = useState<ProfileModel | null>(null);

  const handleAddItemToCart = async (product: ProductModel) => {
    // 1. Check if we have a user in state
    if (!currentUser) {
      alert(
        "Por favor, faça login como cliente para adicionar itens ao carrinho",
      );
      return;
    }

    // 2. If we have a user, proceed to add to cart
    try {
      console.log(product);
      const response = await AddToCart(product.id!, 1);
      if (response.ok) {
        console.log("Item added:");
        alert(`${product.name} adicionado ao carrinho!`);
      } else if (response.status === 403) {
        alert(
          "Para fazer um pedido ou adicionar um item ao carrinho, você deve criar uma conta de cliente.",
        );
      } else if (response.status === 400 || response.status === 404) {
        alert(await response.text());
      } else {
        alert("Falha ao adicionar o item ao carrinho.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const loadData = async () => {
    const [prodResponse, userResponse] = await Promise.all([
      getAllProducts(),
      getUserProfileData(),
    ]);

    if (prodResponse.status === 200) {
      const prodData = await prodResponse.json();
      setProducts(prodData);
    }
    if (userResponse) {
      setCurrentUser(userResponse);
    } else {
      return;
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  console.log(products);

  {
    /* This is the section that calls the backend to return the products and services*/
  }
  return (
    <section className="products-section" id="products">
      <div className="section-header">
        {/* <h2 className="section-title">
          Featured
          <br />
          Products
        </h2> */}
        {/* <a href="#" className="section-link">
          View all →
        </a> */}
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-thumb">
              {(product.imgS3UrlKeys?.length ?? 0) > 0 ? (
                /* preencher toda a miniatura com o carrossel */
                <div style={{ position: "absolute", inset: 0 }}>
                  <ImageCarousel
                    imageKeys={product.imgS3UrlKeys}
                    width={"100%"}
                    height={150}
                    altText={product.name}
                  />
                </div>
              ) : (
                /* fallback: a inicial Playfair, como antes */
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2.6rem",
                    fontWeight: 900,
                    color: "var(--cream)",
                  }}
                >
                  {product.name?.charAt(0).toUpperCase()}
                </span>
              )}

              <i className="bi bi-bag-heart"></i>
              <span className="product-badge">Novo</span>
            </div>
            <div className="product-info">
              <div className="product-category">
                {product.productType.replaceAll("_", " ")}
              </div>
              <div className="product-name">{product.name}</div>
              <div className="product-footer">
                <span className="product-price">
                  ${product.price} por {product.unit}
                </span>
                <button
                  className="add-btn"
                  onClick={() => handleAddItemToCart(product)}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default GetOfferingSection;
