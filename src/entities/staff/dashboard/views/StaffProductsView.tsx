import AddProductModal from "../../../company/pages/addProductModal";
import ViewProductModal from "../../../company/pages/viewProductModal";
import EditProductModal from "../../../company/pages/editProductModal";
import { useEffect, useState } from "react";
import { CompanyModel, ProductModel, StaffModel } from "../../../../api/interfaces";
import { addProduct, getCompanyByID, getCompanyDashboard, getProductsByCompanyId, getStaffProfile, updateProduct } from "../../../../api/requests";
import { useNavigate } from "react-router-dom";

interface Props {
  products: ProductModel[];
  staff: StaffModel;
  company: CompanyModel
}

function StaffProductsView({ products, staff, company }: Props) {
const navigate = useNavigate();
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
      const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
      const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
      const [productList, setProductList] = useState<ProductModel[]>([]);

  const handleUpdateProduct = async (product: ProductModel) => {
          const response = await updateProduct(product.id!, product);
          console.log("Trying to update product: ", response)

          if (response.status === 200) {
              alert("Product Updated successfully");
              navigate("/staff-dashboard")
              setShowProductModal(false);
          }
          if (response.status === 403) {
              alert("YOU DO NOT HAVE THE PERMISSIONS TO UPDATE PRODUCTS. PLEASE CONTACT YOUR EMPLOYER");
              setShowProductModal(false);
          }else{
              alert("There was an issue updating the product");
              return;
          }
      };

      const loadProducts = async () => {
        const response = await getProductsByCompanyId(company.id!);
        if(response.ok){
          const data = await response.json();
          console.log("Products: ", data);
          setProductList(data);
        }
      }

  
      const handleSaveProduct = async (product: ProductModel) => {
          const response = await addProduct(product);
          if (response.status === 201) {
              alert("Product Added successfully");
               navigate("/staff-dashboard")
              setShowProductModal(false);
          } else if (response.status === 403) {
              alert("YOU DO NOT HAVE THE PERMISSIONS TO ADD PRODUCTS. PLEASE CONTACT YOUR EMPLOYER");
              setShowProductModal(false);
          }
          else{
            alert("There was an issue updating the product");
            return;
          }
            
      };
      // Wait for entity to load before showing modal
          const openAddModal = () => {
              if (staff) {
                  setModalMode('add');
                  setSelectedProduct(null);
                  setShowProductModal(true);
              } else {
                  alert("Loading user data, please try again");
              }
          };
      
          const openEditModal = (product: ProductModel) => {
              if (staff) {
                  setModalMode('edit');
                  setSelectedProduct(product);
                  setShowProductModal(true);
              } else {
                  alert("Loading user data, please try again");
              }
          };
      
              const openViewModal = (product: ProductModel) => {
              if (staff) {
                  setModalMode('view');
                  setSelectedProduct(product);
                  setShowProductModal(true);
              } else {
                  alert("Loading user data, please try again");
              }
          };

        useEffect(() => {
              if (products) {
                 //loadProducts();
              }
          }, [company?.id]);
        
  
      
  return (
    <>
      <div className="view-heading" style={{ marginTop: 40 }}>
        Products
      </div>
      <div className="view-sub">Manage product listings for your company.</div>

      <div className="quick-actions">
        <button className="qa-btn primary">
          <i className="bi bi-plus-lg" onClick={openAddModal}></i> Add Product
        </button>
      </div>


        <div className="product-grid">
        {products.map( (product) => (
            
          <div className="product-card" key={product.id}>
            <div className="product-thumb">
                <i className="bi bi-bag-heart"></i>
                <span className="product-badge">{product.productType.replaceAll("_", " ").toUpperCase()}</span>
            </div>
            <div className="product-info">
            <div className="product-category"></div>
            <div className="product-name">{product.name}</div>
            <div className="product-footer">
                <span className="product-price">${product.pricePerUnit} per {product.unitType}</span>
            </div>
            <div className="biz-actions">
                <button className="biz-btn view" onClick={()=> {openViewModal(product)}}>
                    <i className="bi bi-eye"></i>View</button>
                <button className="biz-btn edit" onClick={() => openEditModal(product)}>
                    <i className="bi bi-pencil"></i> Edit
                </button>
                <button className="biz-btn del"><i className="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
            ))}
        </div>
          {/* Single Modal */}
            {products && staff && showProductModal && (
                <>
                { modalMode === 'add' && (
                    <AddProductModal
                        isOpen={showProductModal}
                        onClose={() => {
                            setShowProductModal(false);
                            setSelectedProduct(null);
                        }}
                        onSave={handleSaveProduct}
                        companyId={staff?.companyId!}
                        creator={staff}
                        companyName={company.name}
                    />
                )}
                {modalMode === "edit" && (
                    <EditProductModal
                        isOpen={showProductModal}
                        product={selectedProduct!}
                        onClose={() => {
                            setShowProductModal(false);
                            setSelectedProduct(null);
                        }}
                        onSave={handleUpdateProduct}
                        company={company!}
                        username={staff.username}
                    />
                    )}
                    {modalMode === "view" &&(
                          <ViewProductModal
                        isOpen={showProductModal}
                        product={selectedProduct!}
                        onClose={() => {
                            setShowProductModal(false);
                            setSelectedProduct(null);
                        }}
                    />
                    )
                    }
                </>
            )}
           

    </>
  );
}

export default StaffProductsView;


