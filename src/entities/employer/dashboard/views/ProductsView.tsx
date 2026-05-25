function ProductsView() {
  return (
    <>
      <div className="view-heading">Products</div>
      <div className="view-sub">Manage your product listings.</div>

      <div className="quick-actions">
        <button className="qa-btn primary"><i className="bi bi-plus-lg"></i> Add Product</button>
      </div>

      <div className="dash-card">
        <div className="card-head">
          <span className="card-title">All Products</span>
          <a className="card-action">Export</a>
        </div>
        <table className="orders-table">
          <thead>
            <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Wireless Headphones</td><td>Electronics</td><td>$99.00</td><td>24</td><td><span className="status-chip delivered">Active</span></td></tr>
            <tr><td>Leather Crossbody</td><td>Accessories</td><td>$149.00</td><td>12</td><td><span className="status-chip delivered">Active</span></td></tr>
            <tr><td>Ceramic Table Lamp</td><td>Home</td><td>$79.00</td><td>4</td><td><span className="status-chip pending">Low Stock</span></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ProductsView;