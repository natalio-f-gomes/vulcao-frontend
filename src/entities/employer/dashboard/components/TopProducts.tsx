const products = [
  { rank: 1, icon: "bi-headphones",  name: "Wireless Headphones", cat: "Electronics", rev: "$9,240", delta: "↑ 18%" },
  { rank: 2, icon: "bi-bag-heart",   name: "Leather Crossbody",   cat: "Accessories", rev: "$7,810", delta: "↑ 9%"  },
  { rank: 3, icon: "bi-lamp",        name: "Ceramic Table Lamp",  cat: "Home",        rev: "$5,450", delta: "↑ 4%"  },
  { rank: 4, icon: "bi-watch",       name: "Minimalist Watch",    cat: "Watches",     rev: "$4,920", delta: "↑ 6%"  },
];

function TopProducts() {
  return (
    <div className="dash-card">
      <div className="card-head">
        <span className="card-title">Top Products</span>
        <a className="card-action">View All</a>
      </div>
      {products.map((p) => (
        <div className="product-row" key={p.rank}>
          <span className="product-rank">{p.rank}</span>
          <div className="product-thumb-sm"><i className={`bi ${p.icon}`}></i></div>
          <div className="product-info-sm">
            <div className="product-name-sm">{p.name}</div>
            <div className="product-cat-sm">{p.cat}</div>
          </div>
          <div className="product-rev">{p.rev}<span>{p.delta}</span></div>
        </div>
      ))}
    </div>
  );
}

export default TopProducts;