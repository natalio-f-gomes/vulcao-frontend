import { useNavigate } from "react-router-dom";
import "../../../css/dashboard.css";
import { useEffect, useState } from "react";
import { ProfileModel } from "../../../Interfaces/Authentication";
import { ResponsiveSidebar } from "../../../hooks/ResponsiveSidebar";
import GetFooterSection from "../../../Components/getFooter";
import { useResponsiveSidebar } from "../../../hooks/useResponsiveSidebar";
import { getProfile } from "../../../Requests/global";
import UserDashSideBar from "./components/Sidebar";
import GetUserDashBoard from "./views/Dashboard";

export type UserDashView =
  | "overview"
  | "cart"
  | "orders"
  | "security"
  | "contact"
  | "personalInfo"
  | "address";

function GetUserAccountPage() {
  const [currentView, setCurrentView] = useState<UserDashView>("overview");
  const [currentUser, setCurrentUser] = useState<ProfileModel | null>(null);

  const navigate = useNavigate();
  const sidebar = useResponsiveSidebar(768);

  const handleNavigate = (view: UserDashView) => {
    setCurrentView(view);
    sidebar.close();
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await getProfile("CLIENT");
        if (response.status === 200) {
          const data = await response.json();
          if (!data) {
            return;
          }
          localStorage.setItem("username", data.username);
          setCurrentUser(data);
        }
      } catch (error) {
        console.error("Network or API error ", error);
      }
    };
    getCurrentUser();
  }, [navigate]);

  const renderView = () => {
    if (!currentUser) return <div>Loading...</div>;
    switch (currentView) {
      case "overview":
        return <GetUserDashBoard />;

      default:
        return <GetUserDashBoard />;
    }
  };

  return (
    <>
      <div className="profile-page">
        <ResponsiveSidebar
          isOpen={sidebar.isOpen}
          isMobile={sidebar.isMobile}
          onOpen={sidebar.open}
          onClose={sidebar.close}
          ariaLabel="Account navigation"
        >
          <UserDashSideBar
            currentView={currentView}
            onNavigate={handleNavigate}
            currentUser={currentUser!}
          />
        </ResponsiveSidebar>
        <div className="view active">{renderView()}</div>
      </div>
      <GetFooterSection />
    </>
  );
}

export default GetUserAccountPage;
