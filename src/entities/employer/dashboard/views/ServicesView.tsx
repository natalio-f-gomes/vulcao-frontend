function ServicesView() {
  return (
    <>
      <div className="view-heading">Services</div>
      <div className="view-sub">Manage your service offerings.</div>

      <div className="quick-actions">
        <button className="qa-btn primary"><i className="bi bi-plus-lg"></i> Add Service</button>
      </div>

      <div className="dash-card">
        <div className="card-head">
          <span className="card-title">All Services</span>
        </div>
        <table className="orders-table">
          <thead>
            <tr><th>Service</th><th>Category</th><th>Price</th><th>Duration</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Home Delivery</td><td>Logistics</td><td>$15.00</td><td>1-2 days</td><td><span className="status-chip delivered">Active</span></td></tr>
            <tr><td>Installation</td><td>Technical</td><td>$45.00</td><td>2-4 hrs</td><td><span className="status-chip delivered">Active</span></td></tr>
            <tr><td>Extended Warranty</td><td>Support</td><td>$25.00</td><td>1 year</td><td><span className="status-chip pending">Pending</span></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ServicesView;