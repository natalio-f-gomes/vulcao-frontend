import KpiGrid        from "../components/KpiGrid"
import RevenueOverview from "../components/RevenueView";
import TopProducts    from "../components/TopProducts";
import ActivityFeed   from "../components/ActivityFeed";

function OverviewView() {
  return (
    <>
   

      {/*<KpiGrid /> */}

      <div className="mid-row">
       {/* <RevenueOverview /> */} {/* TO IMPLEMENT LATER ON */}
        {/*<TopProducts />*/} {/* TO IMPLEMENT LATER ON */}
      </div>

      <div className="mid-row">
        {/*<ActivityFeed />*/}
      </div>
    </>
  );
}

export default OverviewView;