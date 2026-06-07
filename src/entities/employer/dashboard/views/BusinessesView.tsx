import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterBusinessModal from "../modals/RegisterBusinessModal";
import EditBusinessModal from "../modals/EditBusinessModal";
import { CompanyModel } from "../../../../api/interfaces";
import { getEmployerCompanies, updateCompany } from "../../../../api/requests";
import ImageCarousel from "../../../../components/ImageCarousel";
import UpdateCompanyImageModal from "../modals/CompanyUpdateImageModal";

function BusinessesView() {
  const navigate = useNavigate();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<CompanyModel | null>(null);
  const [editingImagesFor, setEditingImagesFor] = useState<CompanyModel | null>(null);
  const [businesses, setBusinesses] = useState<CompanyModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEmployerCompanies();
      if (response.ok) {
        const data = await response.json();
        console.log("companies: ",data)
        setBusinesses(data);
      } else {
        setError(`Could not load companies (${response.status})`);
      }
    } catch (err) {
      setError(`There was an issue fetching the companies: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveBusinessUpdate = async (updateData: CompanyModel) => {
    try {
      const response = await updateCompany(updateData.id!, updateData);
      if (response.ok) {
        setEditingBusiness(null);
        await loadCompanies();
        return;
      }
      if (response.status === 400) {
        alert("There was a problem with your request, please ensure this company name is not being used.");
      } else if (response.status === 403) {
        alert("Access DENIED");
      }
    } catch (err) {
      setError(`There was an issue updating the company: ${err}`);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const visitCompanyDashboardHandler = (businessId: string): void => {
    navigate(`/company-dashboard/${businessId}`);
  };

  return (
    <>
      <div className="view-heading" style={{ marginTop: "40px" }}>My Businesses</div>
      <div className="view-sub">Manage and monitor all your registered businesses.</div>

      <div className="quick-actions">
        <button className="qa-btn primary" onClick={() => setShowRegisterModal(true)}>
          <i className="bi bi-plus-lg"></i> Register New Business
        </button>
      </div>

      <div className="biz-grid">
        {businesses.map((company) => {
          const hasImages = (company.imgS3UrlKeys?.length ?? 0) > 0;
          return (
            <div className="biz-card" key={company.id}>
              {/* ---- banner: status badge only ---- */}
              <div className="biz-banner">
                <span className={`biz-status-badge ${company.status === "OPERATING" ? "active" : "inactive"}`}>
                  {company.status}
                </span>
              </div>

              <div className="biz-body">
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                  <ImageCarousel
                    imageKeys={company.imgS3UrlKeys}
                    width={200}
                    height={130}
                    altText={company.name}
                  />
                </div>

                <div className="biz-name">{company.name}</div>
                <div className="biz-cat">{company.category?.replaceAll("_", " ")}</div>

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
                  {company.id && (
                    <button className="biz-btn view" onClick={() => visitCompanyDashboardHandler(company.id!)}>
                      <i className="bi bi-eye"></i> View
                    </button>
                  )}
                  <button className="biz-btn edit" onClick={() => setEditingBusiness(company)}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button className="biz-btn del">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                {/* image management — always available, label adapts */}
                <div className="biz-actions" style={{ marginTop: 6 }}>
                  <button
                    className="biz-btn edit"
                    style={{ flex: 1 }}
                    onClick={() => setEditingImagesFor(company)}
                  >
                    <i className="bi bi-images"></i>{" "}
                    {hasImages ? "Edit Images" : "Upload Images"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="biz-card-new" onClick={() => setShowRegisterModal(true)}>
          <i className="bi bi-plus-circle"></i>
          <span>Register a Business</span>
        </div>
      </div>

      <RegisterBusinessModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={loadCompanies}
      />

      <EditBusinessModal
        isOpen={editingBusiness !== null}
        business={editingBusiness}
        onClose={() => setEditingBusiness(null)}
        onSave={saveBusinessUpdate}
      />

      { editingImagesFor && (
        <UpdateCompanyImageModal
        onClose={()=> setEditingImagesFor(null)}
        isOpen={editingImagesFor !== null}
        company={editingImagesFor}
        />
      )}


      {/* TODO: wire your company image modal here (the company equivalent of
          UploadImageModal / EditProductImagesModal). It receives the company
          whose images are being managed and refreshes the list on success. */}
      {/* {editingImagesFor && (
        <CompanyImagesModal
          isOpen={editingImagesFor !== null}
          company={editingImagesFor}
          onClose={() => setEditingImagesFor(null)}
          onSuccess={loadCompanies}
        />
      )} */}
    </>
  );
}

export default BusinessesView;