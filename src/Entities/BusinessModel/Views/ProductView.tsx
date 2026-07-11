import { useEffect, useState } from "react";
import { BusinessModel } from "../../../Interfaces/businesses";
import { ProductModel } from "../../../Interfaces/offerings";
import ImageCarousel from "../../../Components/imageCarousel";
import {
  deleteProduct,
  findProductsByCompanyId,
  updateProduct,
} from "../../../Requests/offerings";
import { ConfirmDeleteModal } from "../../../Components/Modals/ConfirmDeleteModal";

import UploadImageModal from "../../../Components/Modals/UpdateImageModal";
import { formatDateTime } from "../../Shopping/types";
import EditProductModal from "../Modals/Product/EditProductModal";
import AddProductModal from "../Modals/Product/AddProductModal";
import ViewProductModal from "../Modals/Product/ViewProductModal";

interface Paramaters {
  business: BusinessModel;
}

function ProductView({ business }: Paramaters) {
  const [productList, setProductList] = useState<ProductModel[]>([]);
  const [productToView, setProductToView] = useState<ProductModel | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductModel | null>(null);
  const [productImageUpload, setProductImageUpload] =
    useState<ProductModel | null>(null);

  const [productToDelete, setProductToDelete] = useState<ProductModel | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const updateProductRequest = async (product: ProductModel) => {
    let errorMessage =
      "Ocorreu um erro inesperado. Por favor, tente novamente.";
    const response = await updateProduct(product.id!, product);

    if (response.status === 200) {
      alert("Producto Atualizada");
      await getProducts();
      setProductToEdit(null);
      return;
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
      return;
    } else {
      alert("Ocorreu um erro ao atualizar o produto.");
      console.log("There was an isseu upading the product: ", response);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      const response = await deleteProduct(productToDelete.id!);
      if (response.status === 200) {
        alert("Produto apagado.");
        setProductToDelete(null);
        await getProducts();
        return;
      } else if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
        setProductToDelete(null);
        return;
      } else {
        alert("Occoreu um erro com o seu pedido");
        setProductToDelete(null);
      }
      setShowConfirm(false);
      getProducts();
    } catch (e: any) {
      setError(e.message || "Failed to delete the product");
    } finally {
      setIsDeleting(false);
      window.location.reload();
    }
  };

  const getProducts = async () => {
    const response = await findProductsByCompanyId(business.id!);
    if (!response.ok) {
      alert("There was an issue with your request");
      return;
    }
    const products = await response.json();
    console.log("Prodcuts fetched: ", products);
    setProductList(products);
  };

  useEffect(() => {
    if (business && business.id) {
      getProducts();
    }
  }, [business?.id]);

  return (
    <>
      <div style={{ marginLeft: 15 }}>
        <div className="view-heading">Inventário de Produtos</div>
        <div className="view-sub">
          Gerir e monitorizar todos os produtos da sua empresa.
        </div>

        <div className="quick-actions">
          <button
            className="qa-btn primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg"></i> Adicionar Novo Produto
          </button>
        </div>

        <div className="biz-grid">
          {productList.map((product) => (
            <div className="biz-card" key={product.id}>
              <div className="biz-banner">
                {/* Estado determinado dinamicamente pelo stock */}
                <span
                  className={`biz-status-badge ${product.stock > 0 ? "active" : "inactive"}`}
                >
                  {product.stock > 0 ? "EM STOCK" : "ESGOTADO"}
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
                {product.imgS3UrlKeys && (
                  <div style={{ marginTop: "12px", marginBottom: "15px" }}>
                    <div
                      className="biz-actions"
                      style={{ width: "100%", marginBottom: "5px" }}
                    >
                      <button
                        className="biz-btn edit"
                        onClick={() => setProductImageUpload(product)}
                      >
                        <i className="bi bi-pencil"></i>
                        {(product.imgS3UrlKeys?.length ?? 0) > 0
                          ? " Editar Imagens"
                          : " Carregar Imagens"}
                      </button>
                    </div>
                  </div>
                )}

                <ImageCarousel
                  imageKeys={product.imgS3UrlKeys}
                  width={200}
                  height={140}
                  altText={product.name}
                />

                {/* Nome e Tipo do Produto */}
                <div
                  className="biz-name"
                  style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                >
                  {product.name}
                </div>
                <div
                  className="biz-cat"
                  style={{
                    color: "#6c757d",
                    fontSize: "0.85rem",
                    marginBottom: "10px",
                  }}
                >
                  {product.productType.replaceAll("_", " ")}
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
                  {product.price} {product.currency} /{" "}
                  {product.unit.replaceAll("_", " ")}
                </div>

                {/* Detalhes do Produto */}
                <div>
                  <div className="biz-stat-label">
                    Stock ({product.unit.replaceAll("_", " ")}s)
                  </div>
                  <div className="biz-stat-val" style={{ fontSize: 15 }}>
                    {product.stock}
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
                    {product.description || "Nenhuma descrição fornecida."}
                  </div>
                </div>

                {/* Estatísticas de Inventário do Produto */}
                <div className="biz-stats" style={{ width: "100%" }}>
                  <div>
                    <div className="biz-stat-val" style={{ fontSize: 12 }}>
                      {formatDateTime(product.createdAt!)}
                    </div>
                    <div className="biz-stat-label">Adicionado a</div>
                  </div>
                  <div>
                    <div className="biz-stat-val" style={{ fontSize: 15 }}>
                      @{product.expirationDate}
                    </div>
                    <div className="biz-stat-label">Data de expiração</div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div
                  className="biz-actions"
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  <button
                    className="biz-btn view"
                    onClick={() => setProductToView(product)}
                  >
                    <i className="bi bi-eye"></i> Ver
                  </button>
                  <button
                    className="biz-btn edit"
                    onClick={() => setProductToEdit(product)}
                  >
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                  <button
                    className="biz-btn del"
                    onClick={() => setProductToDelete(product)}
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
            <span> Adicionar Novo Produto</span>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={getProducts}
        business={business}
      />
      {productToView && (
        <ViewProductModal
          isOpen={productToView !== null}
          onClose={() => setProductToView(null)}
          productToView={productToView}
          businessName={business.name}
        />
      )}
      {productToEdit && (
        <EditProductModal
          onClose={() => setProductToEdit(null)}
          isOpen={productToEdit !== null}
          productToEdit={productToEdit}
          onSave={updateProductRequest}
          companyName={business.name}
        />
      )}
      {productImageUpload && (
        <UploadImageModal
          onClose={() => setProductImageUpload(null)}
          isOpen={productImageUpload !== null}
          entityId={productImageUpload.id!}
          entityType={"OFFERING"}
          entityName={productImageUpload.name}
          existingImages={productImageUpload.imgS3UrlKeys!}
        />
      )}

      {productToDelete && (
        <ConfirmDeleteModal
          isOpen={productToDelete !== null}
          itemName={productToDelete.name}
          itemType="PRODUTO"
          onConfirm={handleDeleteProduct}
          onCancel={() => setProductToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

export default ProductView;
