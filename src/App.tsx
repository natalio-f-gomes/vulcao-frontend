
import React from "react";
import { AuthProvider } from "./api/authentication-handler";
import { Route, Routes } from "react-router-dom";
import GetHeader from "./components/header"
import "./css/main.css"
import "./css/style.css"
import UserRegistrationPage from "./entities/user/user-register";
import GetFooterSection from "./components/footer";
import UserLoginPage from "./entities/user/user-login"
import GetUserAccountPage from "./entities/user/user-account";
import GetHeroSection from "./components/Hero";
import GetFeatureSection from "./components/Feature";
import GetOfferingsSection from "./components/Offerings";
import EmployerLoginPage from "./entities/employer/employer-login";
import EmployerRegistrationPage from "./entities/employer/employer-register";
import EmployerDashboard from "./entities/employer/dashboard/employer-dashboard";
import CompanyDashboard from "./entities/company/company-dashboard";
import StaffLoginPage from "./entities/staff/staff-login";
import StaffDashboard from "./entities/staff/dashboard/StaffDashboard";
import ProductsPage from "./entities/company/pages/products";

function App(){
    return (
    <AuthProvider>
        <Routes>
            <Route path="/" element={
                <>
                <GetHeader/>
                <GetHeroSection/>
                <GetFeatureSection/>
                <GetOfferingsSection/>
                <GetFooterSection/>
                </>
            }/>
            <Route path="/user-register" element={<UserRegistrationPage/>}/>
            <Route path="/user-login" element={<UserLoginPage/>}/>
             <Route path="/user-account" element={<GetUserAccountPage/>}/>

            <Route path="/employer-register" element={<EmployerRegistrationPage/>}/>
            <Route path="/employer-login" element={<EmployerLoginPage/>}/>
            <Route path="/employer-dashboard" element={<EmployerDashboard/>}/>
            <Route path="company-dashboard/:id" element={<CompanyDashboard/>}/>
            <Route path="/staff-login" element={<StaffLoginPage/>}/>
            <Route path="/staff-dashboard" element={<StaffDashboard/>}/>
            <Route path="/company-dashboard/:id/products" element={<ProductsPage/>}/>
        </Routes>
    </AuthProvider>


    )
}

export default App