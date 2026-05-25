import React from "react"

function GetFeatureSection(){
    return (

<section className="features">
  <div className="feature-item">
    <div className="feature-icon"><i className="bi bi-truck"></i></div>
    <div className="feature-title">Free Shipping</div>
    <p className="feature-desc">On all orders over $75. Fast, tracked delivery straight to your door.</p>
  </div>
  <div className="feature-item">
    <div className="feature-icon"><i className="bi bi-arrow-counterclockwise"></i></div>
    <div className="feature-title">Easy Returns</div>
    <p className="feature-desc">30-day hassle-free returns. No questions asked, no hidden fees.</p>
  </div>
  <div className="feature-item">
    <div className="feature-icon"><i className="bi bi-shield-check"></i></div>
    <div className="feature-title">Secure Checkout</div>
    <p className="feature-desc">Bank-grade encryption on every transaction. Shop with confidence.</p>
  </div>
</section>
    )
}
export default GetFeatureSection