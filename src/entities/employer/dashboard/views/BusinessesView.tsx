import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import RegisterBusinessModal from "../components/RegisterBusinessModal";
import { CompanyModel } from "../../../../api/interfaces";
import { getEmployerCompanies, updateCompany } from "../../../../api/requests";
import EditBusinessModal from "../components/EditBusinessModal";
import { useNavigate } from "react-router-dom";

function BusinessesView() {
  const navigate = useNavigate();

  const [showRegisterModal, setShowRegisterModal] = useState(false); 
  const [editingBusiness, setEditingBusiness]     = useState<CompanyModel | null>(null); // ← edit modal
  const [businesses, setBusinesses]               = useState<CompanyModel[]>([]);
  const [isLoading, setIsLoading]                 = useState<boolean>(true);
  const [error, setError]                         = useState<string | null>(null);

  const loadCompanies = useCallback(async ()=> {
    setIsLoading(true);
    try {
      const response = await getEmployerCompanies();
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data);
      }
    } catch (error) {
      setError(`There was an issue fetching the companies: ${error}`);
    } finally {
      setIsLoading(false);
    }
  },[]) // empty array means "create this only once"

  const saveBusinessUpdate = async (updateData: CompanyModel) => {
    try {
      const response = await updateCompany(updateData.id!, updateData);
      if (response.ok) {
        setEditingBusiness(null); // close edit modal
        await loadCompanies();
      }if(response.status === 400){
        alert("There was a problem with your request, please ensure this company name is not being used.")
      }
      if(response.status === 403){
        alert("Access DENIED")
      }
    } catch (error) {
      setError(`There was an issue updating the company: ${error}`);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  if (isLoading) return <div>Loading...</div>;
  if (error)     return <div>{error}</div>;

  const visitCompanyDashboardHandler = (businessId: string): void=>{
      navigate(`/company-dashboard/${businessId}`)
  }

  return (
    <>

      <div className="view-heading"style={{marginTop:"40px"}}  >My Businesses</div>
      <div className="view-sub">Manage and monitor all your registered businesses.</div>

      <div className="quick-actions">
        {/*  Opens the REGISTER modal */}
        <button className="qa-btn primary" onClick={() => setShowRegisterModal(true)}>
          <i className="bi bi-plus-lg"></i> Register New Business
        </button>
      </div>

      <div className="biz-grid">
        {businesses.map((company) => (
          <div className="biz-card" key={company.id}>
            <div className="biz-banner">
              <span className={`biz-status-badge ${company.status === "OPERATING" ? "active" : "inactive"}`}>
                {company.status}
              </span>
            </div>
            <div className="biz-body">
              <div className="biz-name">{company.name}</div>
              <div className="biz-cat">{company.category}</div>
              <div className="biz-stats">
                <div>
                  <div className="biz-stat-val">{company.revenue}</div>
                  <div className="biz-stat-label">Revenue</div>
                </div>
                <div>
                  <div className="biz-stat-val">—</div>
                  <div className="biz-stat-label">Orders</div>
                </div>
                <div>
                  <div className="biz-stat-val">—</div>
                  <div className="biz-stat-label">Products</div>
                </div>
              </div>
              <div className="biz-actions">
                { company.id && (
                <button className="biz-btn view" onClick={() => visitCompanyDashboardHandler(company.id!)}><i className="bi bi-eye"></i>View</button>
                  )}
                {/* Opens the EDIT modal with this company's data */}
                <button className="biz-btn edit" onClick={() => setEditingBusiness(company)}>
                  <i className="bi bi-pencil"></i> Edit
                </button>

                <button className="biz-btn del"><i className="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        ))}

        <div className="biz-card-new" onClick={() => setShowRegisterModal(true)}>
          <i className="bi bi-plus-circle"></i>
          <span>Register a Business</span>
        </div>
      </div>

      {/* Register modal — opens on Register button click */}
      <RegisterBusinessModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={loadCompanies}
      />

    
      {/*  Edit modal — opens when a business is selected for editing */}
      <EditBusinessModal
        isOpen={editingBusiness !== null} //whent he editing business is not null it will open the editbusines modal with the company info in it
        business={editingBusiness}
        onClose={() => setEditingBusiness(null)}
        onSave={saveBusinessUpdate}
      />
    </>
  );
}

export default BusinessesView;