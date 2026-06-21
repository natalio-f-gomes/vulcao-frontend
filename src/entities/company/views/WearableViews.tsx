import { useEffect, useState } from "react";
import {
  CompanyModel,
  ProductModel,
  WearableModel,
} from "../../../api/interfaces";
import {
  updateProduct,
  getProductsByCompanyId,
  getWearableByCompanyId,
  updateWearable,
  deleteWearableById,
} from "../../../api/requests";
import AddProductModal from "../modals/products/AddProductModal";
import ViewProductModal from "../modals/products/ViewProductModal";
import EditProductModal from "../modals/products/EditProductModal";
import ImageCarousel from "../../../components/ImageCarousel";
import UploadImageModal from "../modals/ProductUpdateImageModal";
import AddWearableModal from "../modals/wearables/AddWearableModal";
import WearableUploadImageModal from "../modals/WearableUpdateImageModal";
import EditWearableModal from "../modals/wearables/EditWearableModal";
import ViewWearableModal from "../modals/wearables/ViewWearableModal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";

interface Paramaters {
  company: CompanyModel;
  currentEntity: string;
}

function WearableView({ company, currentEntity }: Paramaters) {
  const [wearableList, setWearableList] = useState<WearableModel[]>([]);
  const [wearableToview, setWearableToView] = useState<WearableModel | null>(
    null,
  );
  const [wearableToEdit, setWearableToEdit] = useState<WearableModel | null>(
    null,
  );
  const [wearableImageUpload, setWearableImageUpload] =
    useState<WearableModel | null>(null);

  const [wearableToDelete, setWearableToDelete] =
    useState<WearableModel | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const updateWearableRequest = async (wearable: WearableModel) => {
    let errorMessage =
      "Ocorreu um erro inesperado. Por favor, tente novamente.";
    const response = await updateWearable(wearable.id!, wearable);
    console.log("RESPONSE: ", response);
    if (response.status === 200) {
      alert("Vestível utualizada!");
      await getWearables();
      setWearableToEdit(null);
      return;
    } else if (response.status === 400) {
      try {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();

          // Handle different API response structures
          if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (data.details) {
            errorMessage = data.details;
          } else if (typeof data === "string") {
            errorMessage = data;
          } else {
            errorMessage = JSON.stringify(data);
          }
        } else {
          // Handle plain text responses
          const text = await response.text();
          errorMessage =
            text || response.statusText || `Erro ${response.status}`;
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        // Fallback to status text if parsing fails
        errorMessage = response.statusText || `Erro ${response.status}`;
      }
      alert(errorMessage);
      setError(errorMessage);
    }
  };

  const handleDeleteWearable = async () => {
    if (!wearableToDelete) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      const response = await deleteWearableById(wearableToDelete.id!);
      if (response.status === 200) {
        alert("Produto apagada. Atualiza a pagina.");
        setWearableToDelete(null);
        return;
      }
      if (response.status === 403) {
        alert(
          "Não tens permissão para eliminar este vestuário. Contacta o teu chefe para obteres permissão para eliminar vestuários.",
        );
        setWearableToDelete(null);
        return;
      }
      if (response.status === 404) {
        alert("Esse produto nao existe");
        setWearableToDelete(null);
        return;
      } else {
        alert("Occoreu um erro com o seu pedido");
        setWearableToDelete(null);
      }
      setShowConfirm(false);
      getWearables();
    } catch (e: any) {
      setError(e.message || "Failed to delete the product");
    } finally {
      setIsDeleting(false);
    }
  };

  const getWearables = async () => {
    const response = await getWearableByCompanyId(company.id!);
    if (!response.ok) {
      alert("Ocorreu um erro ao processar o seu pedido");
      return;
    }
    const items = await response.json();
    setWearableList(items);
  };

  useEffect(() => {
    if (company && company.id) {
      getWearables();
    }
  }, [company?.id]);

  return (
    <>
      <div style={{ marginLeft: 15 }}>
        <div className="view-heading">Inventário de Vestíveis</div>
        <div className="view-sub">
          Gerir e monitorizar todos os Vestíveis da sua empresa.
        </div>

        <div className="quick-actions">
          <button
            className="qa-btn primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg"></i> Adicionar Novo Vestivel
          </button>
        </div>

        <div className="biz-grid">
          {wearableList.map((item) => (
            <div className="biz-card" key={item.id}>
              <div className="biz-banner">
                {/* Estado determinado dinamicamente pelo stock */}
                <span
                  className={`biz-status-badge ${item.stock > 0 ? "active" : "inactive"}`}
                >
                  {item.stock > 0 ? "EM STOCK" : "ESGOTADO"}
                </span>
              </div>
              <div
                className="biz-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* Cabeçalho da imagem do produto — primeira imagem mostrada, setas quando há várias */}
                {item.imgS3UrlKeys && (
                  <div style={{ marginTop: "12px", marginBottom: "15px" }}>
                    <div
                      className="biz-actions"
                      style={{ width: "100%", marginBottom: "5px" }}
                    >
                      <button
                        className="biz-btn edit"
                        onClick={() => setWearableImageUpload(item)}
                      >
                        <i className="bi bi-pencil"></i>
                        {(item.imgS3UrlKeys?.length ?? 0) > 0
                          ? " Editar Imagens"
                          : " Carregar Imagens"}
                      </button>
                    </div>
                  </div>
                )}

                <ImageCarousel
                  imageKeys={item.imgS3UrlKeys}
                  width={200}
                  height={140}
                  altText={item.name}
                />

                {/* Nome e Tipo do Produto */}
                <div
                  className="biz-name"
                  style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                >
                  {item.name}
                </div>

                {/* Etiqueta de preço */}
                <div
                  className="product-price"
                  style={{
                    fontWeight: "600",
                    color: "#198754",
                    fontSize: "1.1rem",
                    marginBottom: "15px",
                  }}
                >
                  ${item.price}{" "}
                  {item.currency === "CVE" ? "Escudos" : item.currency}
                </div>

                {/* Detalhes do Produto */}
                <div
                  className="product-details"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    fontSize: "0.85rem",
                    color: "#495057",
                    marginBottom: "15px",
                    padding: "0 10px",
                  }}
                >
                  <div style={{ marginBottom: "4px", fontStyle: "italic" }}>
                    <i
                      className="bi bi-card-text"
                      style={{ marginRight: "8px" }}
                    ></i>
                    {item.description || "Nenhuma descrição fornecida."}
                  </div>
                </div>

                {/* Estatísticas de Inventário do Produto */}
                <div className="biz-stats" style={{ width: "100%" }}>
                  <div>
                    <div className="biz-stat-val" style={{ fontSize: 15 }}>
                      {item.stock}
                    </div>
                    <div className="biz-stat-label">Stock</div>
                  </div>
                  <div>
                    <div className="biz-stat-val" style={{ fontSize: 15 }}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "AAAA-MM-DD"}
                    </div>
                    <div className="biz-stat-label">Foi adicionado</div>
                  </div>
                  <div>
                    <div className="biz-stat-val" style={{ fontSize: 15 }}>
                      {item.category}
                    </div>
                    <div className="biz-stat-label">Categoria</div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div
                  className="biz-actions"
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  <button
                    className="biz-btn view"
                    onClick={() => setWearableToView(item)}
                  >
                    <i className="bi bi-eye"></i> Ver
                  </button>
                  <button
                    className="biz-btn edit"
                    onClick={() => setWearableToEdit(item)}
                  >
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                  <button
                    className="biz-btn del"
                    onClick={() => setWearableToDelete(item)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>{" "}
              {/* .biz-body fechado corretamente no final do conteúdo do cartão */}
            </div>
          ))}

          {/* Cartão Adicionar Novo Produto — dentro da grelha para alinhamento */}
          <div className="biz-card-new" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-circle"></i>
            <span> Adicionar Novo Vestível</span>
          </div>
        </div>
      </div>

      <AddWearableModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={getWearables}
        company={company}
      />

      {wearableImageUpload && (
        <WearableUploadImageModal
          onClose={() => setWearableImageUpload(null)}
          isOpen={wearableImageUpload !== null}
          wearableToEdit={wearableImageUpload}
        />
      )}

      {wearableToEdit && (
        <EditWearableModal
          onClose={() => setWearableToEdit(null)}
          isOpen={wearableToEdit !== null}
          wearableToEdit={wearableToEdit}
          onSave={updateWearableRequest}
          companyName={company.name}
          currentEntity={currentEntity}
        />
      )}
      {wearableToview && (
        <ViewWearableModal
          onClose={() => setWearableToView(null)}
          isOpen={wearableToview !== null}
          wearableToView={wearableToview}
          companyName={company.name}
        />
      )}

      {wearableToDelete && (
        <ConfirmDeleteModal
          isOpen={wearableToDelete !== null}
          itemName={wearableToDelete.name}
          itemType="VESTÍVEL"
          onConfirm={handleDeleteWearable}
          onCancel={() => setWearableToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

export default WearableView;
