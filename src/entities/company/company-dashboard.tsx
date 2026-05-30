
import { useNavigate, useParams } from "react-router-dom";
import CompanyTopBar from "./CompanyTopBar";
import { CompanyModel, CompanyStats, ProductModel, RegisterStaffModel, StaffModel } from "../../api/interfaces";
import CompanySidebar, { CompanyView } from "./companySideBar";
import { employerUpdateStaff, getCompanyDashboard, getProductsByCompanyId, getStaffByCompanyId, logoutEntity, registerStaff } from "../../api/requests";
import { useEffect, useRef, useState } from "react";

import { useResponsiveSidebar } from "../../hooks/useResponsiveSidebar";
import { ResponsiveSidebar } from "../../hooks/ResponsiveSidebar";
import GetFooterSection from "../../components/footer";
import CompanyOverviewView from "./views/OverviewView";
import CompanyHeader from "./CompanyTopBar";
import CompanyOverView from "./views/OverviewView";
import CompanyStaffView from "./views/StaffView";
import ProductView from "./views/ProductsView";

function CompanyDashboard(){
    const navigate = useNavigate();
  const {id} = useParams();
  console.log(id)
     const [activeView, setActiveView]  = useState<CompanyView>("overview");
     const [staffList, setStaffList] = useState<RegisterStaffModel[]>([]);
     const [productList, setProductList] = useState<ProductModel[]>([]);
     const [stats, setStats] = useState<CompanyStats>();
     const [company, setCompany] = useState<CompanyModel>({
      id : "",
        createdAt: "",
        updatedAt:  "",
          name: "",
        category: null,
        taxIdNumber: "",
        description: "",
        phoneNumber: "",
        faxNumber: "",
        revenue: 0,
        email: "",
        address:{
          island:"",
          city:"",
          street:"",
          postalCode:"",
          zone:""
        },
          status: null,
        creatorUsername: "",
    });

       // Modal state
     const [editingStaff, setEditingStaff]     = useState<RegisterStaffModel | null>(null);
     const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
     const [deletingStaff, setDeletingStaff]   = useState<RegisterStaffModel | null>(null);
     const staffSectionReference = useRef<HTMLDivElement>(null);
     const sidebar = useResponsiveSidebar(768);
     
     const handleLogout = (entityType: string) =>{
     logoutEntity(entityType)
     navigate("/")
     };
      const getCompanyData = async (companyId: string)=>{
          const response = await getCompanyDashboard(companyId);
          if(!response.ok){
               console.log(`There was an issue getting the company Data: ${response}`)
               return;
          }
          const companyData = await response.json();
          setCompany(companyData);
     }

     const renderView = () => {
          if(!company) return <div>Loading Company ....</div>
          switch (activeView) {
               case "overview": return <CompanyOverView company={company}/>;
               case "staffview": return <CompanyStaffView company={company}/>
               case "productView": return <ProductView company={company}/>
          
               default:
                    return <CompanyOverviewView company={company}/>;
          }
     }

       // Keep staff count stat in sync with actual list
     useEffect(() => {
          if(id){
          getCompanyData(id);
          }
     }, [id]);
     
     useEffect(() => {
    if(id && productList && staffList){
     setStats((prev) => ({ ...prev, staffList: staffList.length, products: productList.length}));
     }
  }, [staffList]);

   return (
        <>
         <div className="profile-page" style={{display:"flex"}}>
               <ResponsiveSidebar
                    isOpen={sidebar.isOpen}
                    isMobile={sidebar.isMobile}
                    onOpen={sidebar.open}
                    onClose={sidebar.close}
                    ariaLabel="Account navigation"
                    >
                    <CompanySidebar
                         company={company!}
                         onBack={()=> {navigate("/company-dashboard")}}
                         onLogout={handleLogout}
                         activeView={activeView}
                         onNavigate={(view) => setActiveView(view)}
                    />
               </ResponsiveSidebar>
               <div style={{ flex: 1, display: 'flex', minWidth: 0, flexDirection: 'column' }} className="main-content-area">
                    <CompanyHeader
                    companyName={company.name}
                    onBack={() => (navigate("/employer-dashboard"))}
                    />
               <div className="view active">{renderView()}</div>
          </div>
     </div>
        <GetFooterSection/>
        </>
   )
}

export default CompanyDashboard;