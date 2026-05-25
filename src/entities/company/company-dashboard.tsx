
import { href, useAsyncError, useNavigate, useParams } from "react-router-dom";
import CompanyTopBar from "./CompanyTopBar";
import { CompanyModel, CompanyStats, ProductModel, RegisterStaffModel, StaffModel } from "../../api/interfaces";
import CompanySidebar, { CompanyView } from "./companySideBar";
import { employerUpdateStaff, getCompanyDashboard, getProductsByCompanyId, getStaffByCompanyId, logoutEntity, registerStaff } from "../../api/requests";
import { useEffect, useRef, useState } from "react";
import CompanyHeader from "./components/CompanyHeader";
import CompanyInfoGrid from "./components/CompanyInfoGrid";
import StaffModal from "./components/StaffModal";
import StaffSection from "./components/StaffSection";

function CompanyDashboard(){
    const navigate = useNavigate();
  const {id} = useParams();
  console.log(id)
     const [activeView, setActiveView]  = useState<CompanyView>("overview");
     const [staffList, setStaffList] = useState<RegisterStaffModel[]>([]);
     const [productList, setProductList] = useState<ProductModel[]>([]);
     const [stats, setStats] = useState<CompanyStats>();
       // Modal state
     const [editingStaff, setEditingStaff]     = useState<RegisterStaffModel | null>(null);
     const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
     const [deletingStaff, setDeletingStaff]   = useState<RegisterStaffModel | null>(null);
     const staffSectionReference = useRef<HTMLDivElement>(null);

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
    const getProducts = async (companyId: string) => {
     const response = await getProductsByCompanyId(companyId);
     if(!response.ok){
          console.log(`There was anissue getting the products: ${response}`)
          return;
     }
     const products = await response.json();
     console.log(products)
     setProductList(products)
    };

     const getStaff = async (companyId: string) => {
     const response = await getStaffByCompanyId(companyId);
     if(!response.ok){
          console.log(`There was anissue getting the products: ${response}`)
          return;
     }
     const staff = await response.json();
     console.log("Staff ",staff)
     setStaffList(staff)
    };

     const getCompanyData = async (companyId: string)=>{
          const response = await getCompanyDashboard(companyId);
          if(!response.ok){
               console.log(`There was an issue getting the company Data: ${response}`)
               return;
          }
          const companyData = await response.json();
          setCompany(companyData);
          getProducts(companyId);
          getStaff(companyId)

     }

    const handleLogout = (entityType: string) =>{
    logoutEntity(entityType)
    navigate("/")
     };
     const handleAddStaff = () => {
     setEditingStaff(null);     // null = add mode
     setShowStaffModal(true);
     };

     const handleEditStaff = (staff: RegisterStaffModel) => {
     setEditingStaff(staff);      // populated = edit mode
     setShowStaffModal(true);
     };

     const handleDeleteStaff = (staff: RegisterStaffModel) => {
     setDeletingStaff(staff);
  };

     const handleViewStaff = () => {
          staffSectionReference.current?.scrollIntoView({ behavior: "smooth" });
     };

     const handleSaveStaff = async (employeeData: RegisterStaffModel) => {
     try {
          let response;
          
          if (editingStaff) {
               response = await employerUpdateStaff(employeeData.id!, employeeData);
                    console.log(response)
          } else {
               response = await registerStaff(employeeData);
               console.log(response)
          }
          if (response.status === 201 || response.status === 200) {
               alert(editingStaff ? "Staff Updated" : "Staff Added");
               
               // Refresh the local list or fetch fresh data from backend
               if (id) getCompanyData(id); 

               setShowStaffModal(false);
               setEditingStaff(null);

          }
          
          else if (response.status === 409) {
               alert("Somebody with this username or email already exists");
          } 
          else if (response.status === 401) {
               alert("You are unauthorized to perform this action");
          }
          else {
               alert("Please check the fields and try again.");
          }
     } catch (error) {
          console.error("Save error:", error);
     }
     };

  const handleConfirmDelete = () => {
    if (!deletingStaff) return;
    setStaffList((prev) => prev.filter((e) => e.id !== deletingStaff.id));
    setDeletingStaff(null);
  };

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
          <CompanySidebar
          companyId={id!}
          onBack={()=> {navigate("/company-dashboard")}}
          onLogout={handleLogout}
          activeView={activeView}
          onNavigate={(view) => setActiveView(view)}
          />

        <div className="dash-main">
          <CompanyTopBar
               companyName={company.name}
               onBack={() => (navigate("/employer-dashboard"))}
               onEdit={() => {}}
        />
        

        <div className="view active">
          <div className="page">

            <CompanyHeader
              company={company}
              onViewEmployees={handleViewStaff}
            />
            {/* {stats && 
            <CompanyStatsGrid employees={employees.length} services={services.length} reviews={reviews.length} products={products.length} />
            } */}

            <CompanyInfoGrid company={company} />
          <div ref={staffSectionReference}>
               <StaffSection
               employees={staffList}
               onAdd={handleAddStaff}
               onEdit={handleEditStaff}
               onDelete={handleDeleteStaff}
              />
          </div>

          </div>
          </div>
        </div>
              {/* Employee add / edit modal */}
      {company.id && (
        <StaffModal
          isOpen={showStaffModal}
          employee={editingStaff}
          company={company}
          onClose={() => { setShowStaffModal(false); setEditingStaff(null); }}
          onSave={handleSaveStaff}
        />

        )}
        </>
   )
}

export default CompanyDashboard;