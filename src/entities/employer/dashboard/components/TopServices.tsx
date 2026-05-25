const services = [
  { rank: 1, icon: "bi-truck",         name: "Home Delivery",     cat: "Logistics", rev: "$3,120", delta: "↑ 22%" },
  { rank: 2, icon: "bi-tools",         name: "Installation",      cat: "Technical", rev: "$2,450", delta: "↑ 11%" },
  { rank: 3, icon: "bi-shield-check",  name: "Extended Warranty", cat: "Support",   rev: "$1,800", delta: "↑ 7%"  },
  { rank: 4, icon: "bi-arrow-repeat",  name: "Subscription Box",  cat: "Recurring", rev: "$1,200", delta: "↑ 3%"  },
];

function TopServices() {
  return (
    <div className="dash-card">
      <div className="card-head">
        <span className="card-title">Top Services</span>
        <a className="card-action">View All</a>
      </div>
      {services.map((s) => (
        <div className="product-row" key={s.rank}>
          <span className="product-rank">{s.rank}</span>
          <div className="product-thumb-sm"><i className={`bi ${s.icon}`}></i></div>
          <div className="product-info-sm">
            <div className="product-name-sm">{s.name}</div>
            <div className="product-cat-sm">{s.cat}</div>
          </div>
          <div className="product-rev">{s.rev}<span>{s.delta}</span></div>
        </div>
      ))}
    </div>
  );
}

export default TopServices;