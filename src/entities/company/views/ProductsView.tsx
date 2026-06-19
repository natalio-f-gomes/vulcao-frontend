import { useEffect, useState } from "react";
import { CompanyModel, ProductModel } from "../../../api/interfaces";
import { updateProduct, getProductsByCompanyId, deleteProductById } from "../../../api/requests";
import AddProductModal from "../modals/products/AddProductModal";
import ViewProductModal from "../modals/products/ViewProductModal";
import EditProductModal from "../modals/products/EditProductModal";
import ProductImageCarousel from "../../../components/ImageCarousel"; // adjust path
import UploadImageModal from "../modals/ProductUpdateImageModal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";

interface Paramaters {
  company: CompanyModel;
}

function ProductView({ company }: Paramaters) {
  const [productList, setProductList] = useState<ProductModel[]>([]);
  const [productToView, setProductToView] = useState<ProductModel | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductModel | null>(null);
  const [productImageUpload, setProductImageUpload] = useState<ProductModel| null>(null);

  
  const [productToDelete, setProductToDelete] = useState<ProductModel | null>(null);
  const [isDeleting,setIsDeleting] = useState<boolean>(false);
  const [error,setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);



  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const updateProductRequest = async (product: ProductModel) => {
    const response = await updateProduct(product.id!, product);
    console.log("RESPONSE: ", response);
    if (response.status === 200) {
      alert("Producto Atualizada");
      await getProducts();
      setProductToEdit(null);
      return;
    }
  };

   const handleDeleteProduct = async () => {
    if(!productToDelete){return }
    setIsDeleting(true);
    setError(null);
    try {
      const response = await deleteProductById(productToDelete.id!);
      if(response.status === 200){
        alert("Produto apagada. Atualiza a pagina.");
        setProductToDelete(null);
        return;
      }
      if(response.status === 403){
        alert("Nao tens permissao para apagar esse produto");
        setProductToDelete(null);
        return;
      }
      if(response.status === 404){
        alert("Esse produto nao existe");
        setProductToDelete(null);
        return;
      }
      else{
        alert("Occoreu um erro com o seu pedido");
        setProductToDelete(null);
      
      }
      setShowConfirm(false);
      getProducts();
    } catch (e: any) {
      setError(e.message || "Failed to delete the product");
    } finally {
      setIsDeleting(false);
    }
  };



  const getProducts = async () => {
    const response = await getProductsByCompanyId(company.id!);
    if (!response.ok) {
      alert("There was an issue with your request");
      return;
    }
    const products = await response.json();
    setProductList(products);
  };

  useEffect(() => {
    if (company && company.id) {
      getProducts();
    }
  }, [company?.id]);

  return (
<>
  <div style={{marginLeft:15}}>
    <div className="view-heading">Inventário de Produtos</div>
    <div className="view-sub">Gerir e monitorizar todos os produtos da sua empresa.</div>

    <div className="quick-actions">
      <button className="qa-btn primary" onClick={() => setShowAddModal(true)}>
        <i className="bi bi-plus-lg"></i> Adicionar Novo Produto
      </button>
    </div>

    <div className="biz-grid">
      {productList.map((product) => (
        <div className="biz-card" key={product.id}>
          <div className="biz-banner">
            {/* Estado determinado dinamicamente pelo stock */}
            <span className={`biz-status-badge ${product.stock > 0 ? "active" : "inactive"}`}>
              {product.stock > 0 ? "EM STOCK" : "ESGOTADO"}
            </span>
          </div>

          <div
            className="biz-body"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
          > 
            {/* Cabeçalho da imagem do produto — primeira imagem mostrada, setas quando há várias */}
            {product.imgS3UrlKeys && (
              <div style={{ marginTop: "12px", marginBottom: "15px" }}>
                <div className="biz-actions" style={{ width: "100%", marginBottom: "5px" }}>
                  <button 
                    className="biz-btn edit" 
                    onClick={()=> setProductImageUpload(product)}
                  >
                    <i className="bi bi-pencil"></i>
                    {(product.imgS3UrlKeys?.length ?? 0) > 0 ? " Editar Imagens" : " Carregar Imagens"}
                  </button>
                </div>
              </div>
            )}

            <ProductImageCarousel
              imageKeys={product.imgS3UrlKeys}
              width={200}
              height={140}
              altText={product.name}
            />

            {/* Nome e Tipo do Produto */}
            <div className="biz-name" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{product.name}</div>
            <div className="biz-cat" style={{ color: "#6c757d", fontSize: "0.85rem", marginBottom: "10px" }}>{product.productType}</div>

            {/* Etiqueta de preço */}
            <div className="product-price" style={{ fontWeight: "600", color: "#198754", fontSize: "1.1rem", marginBottom: "15px" }}>
              {product.pricePerUnit} {product.currency} / {product.unitType}
            </div>

            {/* Detalhes do Produto */}
            <div className="product-details" style={{ width: "100%", textAlign: "left", fontSize: "0.85rem", color: "#495057", marginBottom: "15px", padding: "0 10px" }}>
              <div style={{ marginBottom: "4px", fontStyle: "italic" }}>
                <i className="bi bi-card-text" style={{ marginRight: "8px" }}></i>
                {product.description || "Nenhuma descrição fornecida."}
              </div>
              <div style={{ marginBottom: "4px" }}>
                <i className="bi bi-calendar-event" style={{ marginRight: "8px" }}></i>
                Expira: {product.expirationDate || "N/A"}
              </div>
              {product.companyName && (
                <div><i className="bi bi-building" style={{ marginRight: "8px" }}></i>{product.companyName}</div>
              )}
            </div>

            {/* Estatísticas de Inventário do Produto */}
            <div className="biz-stats" style={{ width: "100%" }}>
              <div>
                <div className="biz-stat-val" style={{ fontSize: 15 }}>{product.stock}</div>
                <div className="biz-stat-label">Stock ({product.unitType}s)</div>
              </div>
              <div>
                <div className="biz-stat-val" style={{ fontSize: 15 }}>
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "AAAA-MM-DD"}
                </div>
                <div className="biz-stat-label">Adicionado a</div>
              </div>
              <div>
                <div className="biz-stat-val" style={{ fontSize: 15 }}>@{product.creatorUsername}</div>
                <div className="biz-stat-label">Adicionado por</div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="biz-actions" style={{ width: "100%", marginTop: "15px" }}>
              <button className="biz-btn view" onClick={() => setProductToView(product)}>
                <i className="bi bi-eye"></i> Ver
              </button>
              <button className="biz-btn edit" onClick={() => setProductToEdit(product)}>
                <i className="bi bi-pencil"></i> Editar
              </button>
              <button className="biz-btn del"   onClick={() => setProductToDelete(product)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div> {/* .biz-body fechado corretamente no final do conteúdo do cartão */}
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
        company={company}
      />
      {productToView && (
        <ViewProductModal
          isOpen={productToView !== null}
          onClose={() => setProductToView(null)}
          productToView={productToView}
          companyName={company.name}
        />
      )}
      {productToEdit && (
        <EditProductModal
          onClose={() => setProductToEdit(null)}
          isOpen={productToEdit !== null}
          productToEdit={productToEdit}
          onSave={updateProductRequest}
          companyName={company.name}
        />
      )}
      { productImageUpload && (
        <UploadImageModal
        onClose={()=> setProductImageUpload(null)}
        isOpen={productImageUpload !== null}
        productToEdit={productImageUpload}
        />
      )}

        { productToDelete && (
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
