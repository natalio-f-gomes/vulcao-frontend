
import React, { useEffect, useState } from "react";
import { CompanyModel, EmployerModel, ProductModel, StaffModel } from "../../../api/interfaces";
import { useParams } from "react-router-dom";
import { addProduct, getCompanyByID, getEmployerProfile, getProductsByCompanyId, getStaffProfile, updateProduct } from "../../../api/requests";
import EditProductModal from "./editProductModal";
import AddProductModal from "./addProductModal";
import ViewProductModal from "./viewProductModal";


function ProductsPage() {
    const { id } = useParams();
    const [productList, setProductList] = useState<ProductModel[]>([]);
    const [showProductModal, setShowProductModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
    const [companyData, setCompanyData] = useState<CompanyModel | null>(null);
    const [entity, setEntity] = useState<StaffModel | EmployerModel | null>(null);

    const handleUpdateProduct = async (product: ProductModel) => {
        const response = await updateProduct(product.id!, product);
        console.log("Trying to update product: ", response)
        if (!response.ok) {
            alert("There was an issue updating the product");
            return;
        }
        if (response.status === 200) {
            alert("Product Updated successfully");
            getProducts(id!); // Refresh list
            setShowProductModal(false);
        }
    };

    const handleSaveProduct = async (product: ProductModel) => {
        const response = await addProduct(product);
        if (!response.ok) {
            alert("There was an issue adding the product");
            return;
        }
        if (response.status === 201) {
            alert("Product Added successfully");
            getProducts(id!); // Refresh list
            setShowProductModal(false);
        }
    };

    const getEmployerData = async () => {
        const response = await getEmployerProfile();
        if (!response.ok) {
            console.log(`Error: ${response.status}`);
            return;
        }
        const employer = await response.json();
        setEntity(employer);
    };




    const getProducts = async (companyId: string) => {
        try {
            const companyResponse = await getCompanyByID(companyId);
            if (!companyResponse.ok) {
                console.log(`Error: ${companyResponse.status}`);
                return;
            }
            const company = await companyResponse.json();
            setCompanyData(company);

            const response = await getProductsByCompanyId(companyId);
            if (!response.ok) {
                console.log(`Error: ${response.status}`);
                return;
            }
            const products = await response.json();
            setProductList(products);
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    useEffect(() => {
        if (id) {
            getProducts(id);
            getEmployerData();
        }
    }, [id]);

    // Wait for entity to load before showing modal
    const openAddModal = () => {
        if (entity) {
            setModalMode('add');
            setSelectedProduct(null);
            setShowProductModal(true);
        } else {
            alert("Loading user data, please try again");
        }
    };

    const openEditModal = (product: ProductModel) => {
        if (entity) {
            setModalMode('edit');
            setSelectedProduct(product);
            setShowProductModal(true);
        } else {
            alert("Loading user data, please try again");
        }
    };

        const openViewModal = (product: ProductModel) => {
        if (entity) {
            setModalMode('view');
            setSelectedProduct(product);
            setShowProductModal(true);
        } else {
            alert("Loading user data, please try again");
        }
    };

    return (
        <section className="products-section" id="products">
              <div className="section-header">
                <h2 className="section-title">Products</h2>
               <button className="btn btn-primary me-2" onClick={openAddModal}>
                    Add Product
                </button>
            </div>
        
            
        <div className="product-grid">
        {productList.map( (product) => (
            
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
            {id && entity && showProductModal && (
                <>
                { modalMode === 'add' && (
                    <AddProductModal
                        isOpen={showProductModal}
                        onClose={() => {
                            setShowProductModal(false);
                            setSelectedProduct(null);
                        }}
                        onSave={handleSaveProduct}
                        companyId={companyData?.id!}
                        creator={entity}
                        companyName={companyData?.name!}
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
                        company={companyData!}
                        username={entity.username}
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
           
        </section>
    );
}

export default ProductsPage