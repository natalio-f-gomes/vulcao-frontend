const activities = [
  { dot: "green",  text: <><strong>New order</strong> #SL-4821 placed by Maria Santos</>,    time: "2 minutes ago"  },
  { dot: "blue",   text: <><strong>Stock alert</strong> Wireless Headphones — 4 units left</>, time: "18 minutes ago" },
  { dot: "orange", text: <><strong>New review</strong> ★★★★★ on Leather Crossbody</>,         time: "1 hour ago"     },
  { dot: "red",    text: <><strong>Order cancelled</strong> #SL-4817 refund initiated</>,     time: "2 hours ago"    },
  { dot: "green",  text: <><strong>New customer</strong> Sofia Rodrigues registered</>,       time: "3 hours ago"    },
];

function ActivityFeed() {
  return (
    <div className="dash-card">
      <div className="card-head">
        <span className="card-title">Activity Feed</span>
        <a className="card-action">See All</a>
      </div>
      {activities.map((a, i) => (
        <div className="activity-item" key={i}>
          <div className={`activity-dot ${a.dot}`}></div>
          <div>
            <div className="activity-text">{a.text}</div>
            <div className="activity-time">{a.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;