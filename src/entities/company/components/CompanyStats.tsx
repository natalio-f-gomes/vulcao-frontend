
import { CompanyStats as CompanyStatsModel} from "../../../api/interfaces"

interface Props {
  staffList: number
  products: number
}

function CompanyStats({ staffList, products }: Props) {
  const cards = [
    { label: "Staff", value: staffList, sub: "Active staff"      },
    { label: "Products",  value: products,  sub: "In catalogue"      },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stat-card" key={card.label}>
          <div className="stat-label">{card.label}</div>
          <div className="stat-value">{card.value ?? "—"}</div>
          <div className="stat-sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default CompanyStats;
