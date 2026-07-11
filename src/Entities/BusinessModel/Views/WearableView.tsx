import { useEffect, useState } from "react";
import { BusinessModel } from "../../../Interfaces/businesses";
import { ProductModel, WearableModel } from "../../../Interfaces/offerings";
import ImageCarousel from "../../../Components/imageCarousel";
import {
  deleteProduct,
  findProductsByCompanyId,
  findWearablesByCompanyId,
  updateProduct,
  updateWearable,
} from "../../../Requests/offerings";
import { ConfirmDeleteModal } from "../../../Components/Modals/ConfirmDeleteModal";

import UploadImageModal from "../../../Components/Modals/UpdateImageModal";
import { formatDateTime } from "../../Shopping/types";
import EditProductModal from "../Modals/Product/EditProductModal";
import AddProductModal from "../Modals/Product/AddProductModal";
import ViewProductModal from "../Modals/Product/ViewProductModal";
import AddWearableModal from "../Modals/Wearable/AddWearableModal";
import ViewWearableModal from "../Modals/Wearable/ViewWearableModal";
import EditWearableModal from "../Modals/Wearable/EditWearableModal";

interface Paramaters {
  business: BusinessModel;
}

function WearableView({ business }: Paramaters) {
  const [WearableList, setWearableList] = useState<WearableModel[]>([]);
  const [wearableToView, setWearableToView] = useState<WearableModel | null>(
    null,
  );
  const [wearableToEdit, setWearableToEdit] = useState<WearableModel | null>(
    null,
  );
  const [imageUpload, setImageUpload] = useState<WearableModel | null>(null);

  const [wearableToDelete, setWearableToDelete] =
    useState<WearableModel | null>(null);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const updateRequest = async (wearable: WearableModel) => {
    const response = await updateWearable(wearable.id!, wearable);

    if (response.status === 200) {
      alert("Vestível Atualizado");
      await getWearables();
      setWearableToEdit(null);
      return;
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
      return;
    } else {
      alert("Ocorreu um erro ao atualizar o vestível.");
      console.log("There was an isseu upading the product: ", response);
    }
  };

  const handleDeleteProduct = async () => {
    if (!wearableToDelete) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      const response = await deleteProduct(wearableToDelete.id!);
      if (response.status === 200) {
        alert("Vestível apagado.");
        await getWearables();
        return;
      } else if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
        return;
      } else {
        alert("Occoreu um erro com o seu pedido");
      }
      setShowConfirm(false);
      getWearables();
    } catch (e: any) {
      setError(e.message || "Failed to delete the product");
    } finally {
      setWearableToDelete(null);
      setIsDeleting(false);
      window.location.reload();
    }
  };

  const getWearables = async () => {
    const response = await findWearablesByCompanyId(business.id!);
    if (!response.ok) {
      alert("There was an issue with your request");
      return;
    }
    const wearables = await response.json();
    setWearableList(wearables);
  };

  useEffect(() => {
    if (business && business.id) {
      getWearables();
    }
  }, [business?.id]);

  return (
    <>
      <div style={{ marginLeft: 15 }}>
        <div className="view-heading">Inventário de Vestíveis</div>
        <div className="view-sub">
          Gerir e monitorizar todos os produtos da sua empresa.
        </div>

        <div className="quick-actions">
          <button
            className="qa-btn primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg"></i> Adicionar Novo Vestível
          </button>
        </div>

        <div className="biz-grid">
          {WearableList.map((wearable) => (
            <div className="biz-card" key={wearable.id}>
              <div className="biz-banner">
                {/* Estado determinado dinamicamente pelo stock */}
                <span
                  className={`biz-status-badge ${wearable.stock > 0 ? "active" : "inactive"}`}
                >
                  {wearable.stock > 0 ? "EM STOCK" : "ESGOTADO"}
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
                {wearable.imgS3UrlKeys && (
                  <div style={{ marginTop: "12px", marginBottom: "15px" }}>
                    <div
                      className="biz-actions"
                      style={{ width: "100%", marginBottom: "5px" }}
                    >
                      <button
                        className="biz-btn edit"
                        onClick={() => setImageUpload(wearable)}
                      >
                        <i className="bi bi-pencil"></i>
                        {(wearable.imgS3UrlKeys?.length ?? 0) > 0
                          ? " Editar Imagens"
                          : " Carregar Imagens"}
                      </button>
                    </div>
                  </div>
                )}

                <ImageCarousel
                  imageKeys={wearable.imgS3UrlKeys}
                  width={200}
                  height={140}
                  altText={wearable.name}
                />

                {/* Nome e Tipo do Produto */}
                <div
                  className="biz-name"
                  style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                >
                  {wearable.name}
                </div>
                <div
                  className="biz-cat"
                  style={{
                    color: "#6c757d",
                    fontSize: "0.85rem",
                    marginBottom: "10px",
                  }}
                >
                  {wearable.wearableType.replaceAll("_", " ")}
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
                  {wearable.price} {wearable.currency} /{" "}
                  {wearable.unit.replaceAll("_", " ")}
                </div>

                {/* Detalhes do Produto */}
                <div>
                  <div className="biz-stat-label">
                    Stock ({wearable.unit.replaceAll("_", " ")}s)
                  </div>
                  <div className="biz-stat-val" style={{ fontSize: 15 }}>
                    {wearable.stock}
                  </div>
                </div>
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
                    {wearable.description || "Nenhuma descrição fornecida."}
                  </div>
                </div>

                {/* Estatísticas de Inventário do Produto */}
                <div className="biz-stats" style={{ width: "100%" }}>
                  <div>
                    <div className="biz-stat-val" style={{ fontSize: 12 }}>
                      {formatDateTime(wearable.createdAt!)}
                    </div>
                    <div className="biz-stat-label">Adicionado a</div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div
                  className="biz-actions"
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  <button
                    className="biz-btn view"
                    onClick={() => setWearableToView(wearable)}
                  >
                    <i className="bi bi-eye"></i> Ver
                  </button>

                  <button
                    className="biz-btn edit"
                    onClick={() => setWearableToEdit(wearable)}
                  >
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                  <button
                    className="biz-btn del"
                    onClick={() => setWearableToDelete(wearable)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                {/*
                  <button
                    className="biz-btn del"
                    onClick={() => setProductToDelete(product)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div> */}
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
        business={business}
      />
      {wearableToView && (
        <ViewWearableModal
          isOpen={wearableToView !== null}
          onClose={() => setWearableToView(null)}
          wearableToView={wearableToView}
          businessName={business.name}
        />
      )}

      {wearableToEdit && (
        <EditWearableModal
          onClose={() => setWearableToEdit(null)}
          isOpen={wearableToEdit !== null}
          wearableToEdit={wearableToEdit}
          onSave={updateRequest}
          companyName={business.name}
        />
      )}

      {imageUpload && (
        <UploadImageModal
          onClose={() => setImageUpload(null)}
          isOpen={imageUpload !== null}
          entityId={imageUpload.id!}
          entityType={"OFFERING"}
          entityName={imageUpload.name}
          existingImages={imageUpload.imgS3UrlKeys!}
        />
      )}

      {wearableToDelete && (
        <ConfirmDeleteModal
          isOpen={wearableToDelete !== null}
          itemName={wearableToDelete.name}
          itemType="VESTÍVEL"
          onConfirm={handleDeleteProduct}
          onCancel={() => setWearableToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

export default WearableView;
