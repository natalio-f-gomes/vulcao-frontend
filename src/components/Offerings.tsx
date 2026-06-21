import React, { useEffect, useState } from "react";
import {
  addProductToCart,
  getAllProducts,
  getUserProfileData,
} from "../api/requests";
import { useNavigate } from "react-router-dom";
import { ProductModel, UserProfileModel } from "../api/interfaces";

function GetOfferingsSection() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfileModel | null>(null);
  const navigate = useNavigate();

  const handleAddItemToCart = async (product: ProductModel) => {
    // 1. Check if we have a user in state
    if (!currentUser) {
      alert("Please login in order to add items to cart");
      navigate("/user-login"); // Ensure the leading slash is there
      return;
    }

    // 2. If we have a user, proceed to add to cart
    try {
      console.log(product);
      const response = await addProductToCart(product.id!, 1, "dummy");
      if (response.ok) {
        console.log("Item added:");
        alert("Product Added to cart!");
      } else {
        alert("Failed to add item to cart.");
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
        <h2 className="section-title">
          Featured
          <br />
          Products
        </h2>
        <a href="#" className="section-link">
          View all →
        </a>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-thumb">
              <i className="bi bi-bag-heart"></i>
              <span className="product-badge">New</span>
            </div>
            <div className="product-info">
              <div className="product-category">{product.productType}</div>
              <div className="product-name">{product.name}</div>
              <div className="product-footer">
                <span className="product-price">
                  ${product.pricePerUnit} per {product.unitType}
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

        <div className="product-card">
          <div className="product-thumb">
            <i className="bi bi-watch"></i>
          </div>
          <div className="product-info">
            <div className="product-category">Watches</div>
            <div className="product-name">Minimalist Field Watch</div>
            <div className="product-footer">
              <span className="product-price">$249.00</span>
              <button className="add-btn">
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="product-card">
          <div className="product-thumb" style={{ background: "#e8e4de" }}>
            <i className="bi bi-lamp"></i>
            <span className="product-badge">New</span>
          </div>
          <div className="product-info">
            <div className="product-category">Home</div>
            <div className="product-name">Ceramic Table Lamp</div>
            <div className="product-footer">
              <span className="product-price">$89.00</span>
              <button className="add-btn">
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="product-card">
          <div className="product-thumb">
            <i className="bi bi-headphones"></i>
          </div>
          <div className="product-info">
            <div className="product-category">Electronics</div>
            <div className="product-name">Wireless Headphones</div>
            <div className="product-footer">
              <span className="product-price">$179.00</span>
              <button className="add-btn">
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default GetOfferingsSection;
