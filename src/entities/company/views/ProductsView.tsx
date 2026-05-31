import React, { useEffect, useState } from "react";
import { AddProductModel, CompanyModel, ProductModel } from "../../../api/interfaces";
import { addProduct, updateProduct, getProductsByCompanyId } from "../../../api/requests";
import AddProductModal from "../modals/products/AddProductModal";
import ViewProductModal from "../modals/products/ViewProductModal";
import EditProductModal from "../modals/products/EditProductModal";
import { hanldeResponseStatus } from "./StaffView";

interface Paramaters{
    company: CompanyModel;
}

function ProductView({company}: Paramaters){
    const [productList, setProductList] = useState<ProductModel[]>([]);
    const [productToView, setProductToView] = useState<ProductModel|null>(null);
    const [productToEdit, setProductToEdit] = useState<ProductModel|null>(null);

    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    const updateProductRequest = async (product: ProductModel)=>{
        const response = await updateProduct(product.id!,product);
        console.log("RESPONSE: ", response)
        if(response.status === 200){
            alert("Product Successfully Updated");
            await getProducts();
            setProductToEdit(null);
            return;
        }
        hanldeResponseStatus(response.status)
    }

    const getProducts = async () => {
            const response = await getProductsByCompanyId(company.id!);
            console.log(`Response trying to get the Products: ${response}`);
            if(!response.ok){
                alert("There was an issue with your resquest");
                return;
            }
            const products = await response.json();
            setProductList(products);
            console.log(`Prodcut list: ${products}`)
        }
    
        useEffect( () => {
            if(company && company.id){
                getProducts();
            }
            
        },[company?.id])
    
    return (
       <>
  <div>
    <div className="view-heading">Products Inventory</div>
    <div className="view-sub">Manage and monitor all your company products.</div>

    <div className="quick-actions">
      <button className="qa-btn primary" onClick={()=> setShowAddModal(true)}>
        <i className="bi bi-plus-lg"></i> Add New Product
      </button>
    </div>
   
    <div className="biz-grid">
      {productList.map((product) => (
        <div className="biz-card" key={product.id}>
          <div className="biz-banner">
            {/* Status dynamically determined by stock */}
            <span className={`biz-status-badge ${product.stock > 0 ? "active" : "inactive"}`}>
              {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
            </span>
          </div>
        
          <div className="biz-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            
            {/* Product Image Placeholder */}
            <div className="product-img-container" style={{ marginTop: "1px", marginBottom: "15px", position: "relative" }}>
              <img 
                src="https://placeholder.com" 
                alt="Product Preview" 
                style={{ width: "80px", height: "80px", borderRadius: "12px", border: "4px solid white", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", objectFit: "cover" }}
              />
            </div>

            {/* Product Name and Type */}
            <div className="biz-name" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{product.name}</div>
            <div className="biz-cat" style={{ color: "#6c757d", fontSize: "0.85rem", marginBottom: "10px" }}>{product.productType}</div>
            
            {/* Price tag */}
            <div className="product-price" style={{ fontWeight: "600", color: "#198754", fontSize: "1.1rem", marginBottom: "15px" }}>
              {product.pricePerUnit} {product.currency} / {product.unitType}
            </div>

            {/* Product Meta Details */}
            <div className="product-details" style={{ width: "100%", textAlign: "left", fontSize: "0.85rem", color: "#495057", marginBottom: "15px", padding: "0 10px" }}>
              <div style={{ marginBottom: "4px", fontStyle: "italic" }}><i className="bi bi-card-text" style={{ marginRight: "8px" }}></i>{product.description || "No description provided."}</div>
              <div style={{ marginBottom: "4px" }}><i className="bi bi-calendar-event" style={{ marginRight: "8px" }}></i>Expires: {product.expirationDate || "N/A"}</div>
              {product.companyName && (
                <div><i className="bi bi-building" style={{ marginRight: "8px" }}></i>{product.companyName}</div>
              )}
            </div>

            {/* Product Inventory Stats */}
            <div className="biz-stats" style={{ width: "100%" }}>
              <div>
                <div className="biz-stat-val" style={{fontSize:15}}>{product.stock}</div>
                <div className="biz-stat-label">Stock ({product.unitType}s)</div>
              </div>
              <div>
                <div className="biz-stat-val" style={{fontSize:15}}>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "YYYY-MM-DD"}</div>
                <div className="biz-stat-label">Added On</div>
              </div>
                <div>
                <div className="biz-stat-val" style={{fontSize:15}}>@{product.creatorUsername}</div>
                <div className="biz-stat-label">Added by</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="biz-actions" style={{ width: "100%", marginTop: "15px" }}>
              <button className="biz-btn view" onClick={() => setProductToView(product)}>
                <i className="bi bi-eye"></i> View
              </button>
              <button className="biz-btn edit" onClick={() => setProductToEdit(product)}>
                <i className="bi bi-pencil"></i> Edit
              </button>
              <button className="biz-btn del">
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
   
  </div>
    {/* Add New Prodcut Card */}
    <div className="biz-card-new" onClick={()=> setShowAddModal(true)}>
    <i className="bi bi-plus-circle"></i>
    <span> Add a new  Product</span>
    </div>
    <AddProductModal
        isOpen={showAddModal}
        onClose={()=> setShowAddModal(false)}
        onSuccess={getProducts}
        company={company}
    />
    {productToView && (
        <ViewProductModal
        isOpen={productToView !== null}
        onClose={()=> setProductToView(null)}
        productToView={productToView}
        />
    )}
    {productToEdit && (
        <EditProductModal
        onClose={()=> setProductToEdit(null)}
        isOpen={productToEdit !== null}
        productToEdit={productToEdit}
        onSave={updateProductRequest}
        />
    )}
</>
    )
}

export default ProductView;