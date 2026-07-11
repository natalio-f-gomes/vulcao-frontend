import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Auth/Auth-Handler";
import "./css/main.css";
import ClientLoginPage from "./Entities/ClientModel/client-login";
import ClientRegistrationPage from "./Entities/ClientModel/client-register";
import GetUserAccountPage from "./Entities/ClientModel/profile/client-page";
import ResetPasswordPage from "./Public/PasswordReset";
import EmployerRegistrationPage from "./Entities/EmployerModel/employer-register";
import EmployerLoginPage from "./Entities/EmployerModel/employer-login";
import EmployerDashboard from "./Entities/EmployerModel/dashboard/employer-dashboard";
import BusinessDashboard from "./Entities/BusinessModel/BusinessDashboard";
import GetFeatureSection from "./Components/Features";
import GetHeroSection from "./Components/hero";
import GetFooterSection from "./Components/getFooter";
import AboutPage from "./Public/AboutPage";
import TermsPage from "./Public/TermsPage";
import GetOfferingsSection from "./Components/offerings";
import ShoppingPage from "./Entities/Shopping/ShoppingPage";
import GetHeader from "./Components/getHeader";
import FeatureRequest from "./Public/FeatureRequest";

function App() {
  return (
    <AuthProvider>
      <GetHeader />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <GetHeroSection />
              <GetFeatureSection />

              <GetOfferingsSection />
              <GetFooterSection />
              {/*
              <GetBusinessesSection />

              */}
            </>
          }
        />
        <Route path="/client-register" element={<ClientRegistrationPage />} />
        <Route path="/client-login" element={<ClientLoginPage />} />

        <Route path="/client-dashboard" element={<GetUserAccountPage />} />

        <Route
          path="/employer-register"
          element={<EmployerRegistrationPage />}
        />
        <Route path="/employer-login" element={<EmployerLoginPage />} />

        <Route path="/employer-dashboard" element={<EmployerDashboard />} />

        <Route path="business-dashboard/:id" element={<BusinessDashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/shopping" element={<ShoppingPage />} />
        <Route path="/feature-request" element={<FeatureRequest />} />
        {/* 
        <Route path="/staff-login" element={<StaffLoginPage />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route
          path="/business/public/:id"
          element={<BusinessPublicOverView />}
        />

       
        */}
        <Route path="/password-reset/:entity" element={<ResetPasswordPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
