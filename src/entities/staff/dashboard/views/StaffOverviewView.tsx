import { StaffModel, CompanyModel } from "../../../../api/interfaces";
import { StaffDashView } from "../StaffDashboard";

// Reusing employer-side display components (purely visual / hardcoded data)
import KpiGrid from "../../../employer/dashboard/components/KpiGrid";
import RevenueOverview from "../../../employer/dashboard/components/RevenueView";
import TopProducts from "../../../employer/dashboard/components/TopProducts";
import ActivityFeed from "../../../employer/dashboard/components/ActivityFeed";

interface Props {
  staff:      StaffModel  | null;
  company:    CompanyModel | null;
  onNavigate: (view: StaffDashView) => void;
}

function StaffOverviewView({ staff, company, onNavigate }: Props) {
  return (
    <>
      {/* Quick actions — NO "Register Business". Staff can't create companies. */}
      <div className="quick-actions" style={{ marginTop: "40px" }}>
        <button className="qa-btn primary" onClick={() => onNavigate("orders")}>
          <i className="bi bi-bag-check"></i> View Orders
        </button>
        <button className="qa-btn outline" onClick={() => onNavigate("company")}>
          <i className="bi bi-building"></i> My Company
        </button>
        <button className="qa-btn outline" onClick={() => onNavigate("profile")}>
          <i className="bi bi-person-badge"></i> My Profile
        </button>
      </div>

      {/* Their single company at a glance */}
      {company && (
        <div className="dash-card" style={{ marginTop: 20 }}>
          <div className="card-head">
            <span className="card-title">You're working at</span>
            <a
              className="card-action"
              onClick={() => onNavigate("company")}
              style={{ cursor: "pointer" }}
            >
              View Details
            </a>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              {company.name}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "#6b6b66",
                marginTop: 4,
              }}
            >
              {company.category} · {company.address?.city},{" "}
              {company.address?.island}
            </div>
            {staff?.jobTitle && (
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#9b9b95",
                  marginTop: 6,
                }}
              >
                Role: <strong>{staff.jobTitle}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      <KpiGrid />

      <div className="mid-row">
        <RevenueOverview />
        <TopProducts />
      </div>

      <div className="mid-row">
        <ActivityFeed />
      </div>
    </>
  );
}

export default StaffOverviewView;
