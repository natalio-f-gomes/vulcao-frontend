import { useNavigate } from "react-router-dom";
import { ProfileModel } from "../../../../Interfaces/Authentication";
import { useCallback, useEffect, useState } from "react";
import { BusinessModel } from "../../../../Interfaces/businesses";
import ImageCarousel from "../../../../Components/imageCarousel";
import UpdateImageModal from "../../../../Components/Modals/UpdateImageModal";
import EditBusinessModal from "../../Modals/EditBusinessModal";
import RegisterBusinessModal from "../../Modals/RegisterBusinessModal";
import { updateBusiness } from "../../../../Requests/business";
import { getEmployerBusisnesses } from "../../../../Requests/employer";

interface Props {
  employer: ProfileModel;
}

function BusinessesView({ employer }: Props) {
  const navigate = useNavigate();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<BusinessModel | null>(
    null,
  );
  const [editingImagesFor, setEditingImagesFor] =
    useState<BusinessModel | null>(null);
  const [businesses, setBusinesses] = useState<BusinessModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadBusinesses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEmployerBusisnesses();
      if (response.ok) {
        const data = await response.json();
        console.log("companies: ", data);
        setBusinesses(data);
        for (let co of data) {
          console.log("img: ", co.imgS3UrlKeys);
        }
      } else {
        setError(`Could not load companies (${response.status})`);
      }
    } catch (err) {
      setError(`There was an issue fetching the companies: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveBusinessUpdate = async (updateData: BusinessModel) => {
    try {
      const response = await updateBusiness(updateData.id!, updateData);
      if (response.ok) {
        setEditingBusiness(null);
        await loadBusinesses();
        alert("Empresa Atualizada com sucesso");
        return;
      }
      if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
      } else {
        alert("There was an issue with your request!");
      }
    } catch (err) {
      setError(`There was an issue updating the company: ${err}`);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const visitCompanyDashboardHandler = (businessId: string): void => {
    navigate(`/business-dashboard/${businessId}`);
  };

  return (
    <>
      <div className="view-heading" style={{ marginTop: "40px" }}>
        As Minhas Empresas
      </div>
      <div className="view-sub">
        Gerir e monitorizar todas as suas empresas registadas.
      </div>

      <div className="quick-actions">
        <button
          className="qa-btn primary"
          onClick={() => setShowRegisterModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Registar Nova Empresa
        </button>
      </div>

      <div className="biz-grid">
        {businesses.map((business) => {
          const hasImages = (business.imgS3UrlKeys?.length ?? 0) > 0;
          return (
            <div className="biz-card" key={business.id}>
              {/* ---- banner: apenas distintivo de estado ---- */}
              <div className="biz-banner">
                <span
                  className={`biz-status-badge ${business.status === "OPERACIONAL" ? "active" : "inactive"}`}
                >
                  {business.status === "OPERACIONAL"
                    ? "EM FUNCIONAMENTO"
                    : business.status}
                </span>
              </div>

              <div className="biz-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <ImageCarousel
                    imageKeys={business.imgS3UrlKeys}
                    width={200}
                    height={130}
                    altText={business.name}
                  />
                </div>

                <div className="biz-name">{business.name}</div>
                <div className="biz-cat">
                  {business.type?.replaceAll("_", " ")}
                </div>

                {/* <div className="biz-stats">
                  <div>
                    <div className="biz-stat-val">{company.revenue}</div>
                    <div className="biz-stat-label">Receita</div>
                  </div>
                  <div>
                    <div className="biz-stat-val">—</div>
                    <div className="biz-stat-label">Encomendas</div>
                  </div>
                  <div>
                    <div className="biz-stat-val">—</div>
                    <div className="biz-stat-label">Produtos</div>
                  </div>
                </div> */}

                <div className="biz-actions">
                  {business.id && (
                    <button
                      className="biz-btn view"
                      onClick={() => visitCompanyDashboardHandler(business.id!)}
                    >
                      <i className="bi bi-eye"></i> Ver
                    </button>
                  )}
                  <button
                    className="biz-btn edit"
                    onClick={() => setEditingBusiness(business)}
                  >
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                  {/* <button className="biz-btn del">
                    <i className="bi bi-trash"></i>
                  </button> */}
                </div>

                {/* gestão de imagens — sempre disponível, rótulo adapta-se */}
                <div className="biz-actions" style={{ marginTop: 6 }}>
                  <button
                    className="biz-btn edit"
                    style={{ flex: 1 }}
                    onClick={() => setEditingImagesFor(business)}
                  >
                    <i className="bi bi-images"></i>{" "}
                    {hasImages ? "Editar Imagens" : "Carregar Imagens"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div
          className="biz-card-new"
          onClick={() => setShowRegisterModal(true)}
        >
          <i className="bi bi-plus-circle"></i>
          <span>Register a Empresa</span>
        </div>
      </div>

      {employer.id && (
        <RegisterBusinessModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={loadBusinesses}
          employerId={employer.id}
        />
      )}

      <EditBusinessModal
        isOpen={editingBusiness !== null}
        business={editingBusiness}
        onClose={() => setEditingBusiness(null)}
        onSave={saveBusinessUpdate}
      />

      {editingImagesFor && (
        <UpdateImageModal
          onClose={() => setEditingImagesFor(null)}
          isOpen={editingImagesFor !== null}
          entityId={editingImagesFor.id!}
          entityName={editingImagesFor.name}
          entityType={"BUSINESS"}
          existingImages={editingImagesFor.imgS3UrlKeys!}
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
