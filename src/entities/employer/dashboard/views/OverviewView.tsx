import KpiGrid        from "../components/KpiGrid"
import RevenueOverview from "../components/RevenueView";
import TopProducts    from "../components/TopProducts";
import ActivityFeed   from "../components/ActivityFeed";

function OverviewView() {
  return (
    <>
      <div className="quick-actions" style={{marginTop: "40px"}}>
        <button className="qa-btn primary"><i className="bi bi-plus-lg"></i> Register Business</button>
        <button className="qa-btn outline"><i className="bi bi-building"></i> My Businesses</button>
        <button className="qa-btn outline"><i className="bi bi-download"></i> Export Report</button>
      </div>



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

export default OverviewView;