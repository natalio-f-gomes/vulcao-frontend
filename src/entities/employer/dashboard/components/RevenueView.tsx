function RevenueOverview() {
  return (
    <div className="dash-card">
      <div className="card-head">
        <span className="card-title">Revenue Overview</span>
        <a className="card-action">Full Report</a>
      </div>
      <div className="chart-body">
        <svg viewBox="0 0 620 180" xmlns="http://www.w3.org/2000/svg" width="100%">
          <line x1="0" y1="30"  x2="620" y2="30"  stroke="#f0ece6" strokeWidth="1"/>
          <line x1="0" y1="75"  x2="620" y2="75"  stroke="#f0ece6" strokeWidth="1"/>
          <line x1="0" y1="120" x2="620" y2="120" stroke="#f0ece6" strokeWidth="1"/>
          <line x1="0" y1="165" x2="620" y2="165" stroke="#f0ece6" strokeWidth="1"/>
          <text x="4" y="28"  fontSize="9" fill="#ccc">$60k</text>
          <text x="4" y="73"  fontSize="9" fill="#ccc">$45k</text>
          <text x="4" y="118" fontSize="9" fill="#ccc">$30k</text>
          <text x="4" y="163" fontSize="9" fill="#ccc">$15k</text>
          <defs>
            <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#c8452a" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#c8452a" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M30,140 C80,130 110,100 160,95 C210,90 240,110 290,80 C340,50 370,60 420,45 C470,30 500,55 560,40 L560,165 L30,165 Z" fill="url(#ag)"/>
          <path d="M30,140 C80,130 110,100 160,95 C210,90 240,110 290,80 C340,50 370,60 420,45 C470,30 500,55 560,40" fill="none" stroke="#c8452a" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="30"  cy="140" r="4" fill="#c8452a"/>
          <circle cx="160" cy="95"  r="4" fill="#c8452a"/>
          <circle cx="290" cy="80"  r="4" fill="#c8452a"/>
          <circle cx="420" cy="45"  r="4" fill="#c8452a"/>
          <circle cx="560" cy="40"  r="4" fill="#fff" stroke="#c8452a" strokeWidth="2.5"/>
        </svg>
        <div className="chart-labels">
          {["Oct","Nov","Dec","Jan","Feb","Mar","Apr"].map(m => <span key={m}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}

export default RevenueOverview;