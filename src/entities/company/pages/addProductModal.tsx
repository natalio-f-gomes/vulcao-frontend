import React, { useEffect, useState } from "react";
import { EmployerModel, StaffModel, UnitTypes } from "../../../api/interfaces";
import { CompanyModel, ProductModel } from "../../../api/interfaces";
import { CURRENCIES, PRODUCT_TYPES, UNIT_TYPES } from "../../../api/categories";

interface Parameters{
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: ProductModel) => void;
    companyId: string;
    companyName: string;
    creator: StaffModel | EmployerModel
}

function AddProductModal({isOpen, onClose, onSave, companyId, creator, companyName}:Parameters){


    const [productForm, setProductForm] = useState<ProductModel>({
      name:"",
      productType: "UNKNOWN",
      expirationDate:"",
      description:"",
      stock:0,
      unitType:'' ,
      pricePerUnit:0,
      createdAt:"",
      updatedAt:"",
      companyId: companyId,
      currency: "CVE",
      creatorUsername: "",
      creatorId: ""
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setProductForm( (prev: ProductModel)=>({
            ...prev,
            [name]: value 
        }))

    }

    const handleApiCall = async (event: React.SyntheticEvent) => {
   event.preventDefault();
      setError(null);
      setLoading(true);
      console.log(productForm)
      try{
        productForm.creatorUsername = creator.username;
        productForm.creatorId = creator.id;
        onSave(productForm)
        onClose()
      }catch(error){
          setError(`Registration failed ${error}`)
          console.log(error)
      }finally{setLoading(false)}
    }

    useEffect(()=>{
        setProductForm({
          name:"",
          productType: "UNKNOWN",
          expirationDate:"",
          description:"",
          stock:0,
          unitType:'' ,
          pricePerUnit:0,
          companyId: companyId,
          currency: "CVE",
          creatorUsername: ""
        })
        
    }, [isOpen, companyId]); // Re-run whenever the employee or modal status changes
    if (!isOpen) return null;

    return (
        <form action="" onSubmit={handleApiCall}>
  <div className="modal-overlay open">
    <div className="modal-box" style={{ padding: "40px", minWidth: "500px", borderColor: "red", borderStyle: "solid" }}>
      
      <div className="modal-header">
        <span className="modal-title">
          {"Add New Product"}
        </span>
        <button className="modal-close" onClick={onClose}>
          <i className="bi bi-x"></i>
        </button>
      </div>

      <div className="modal-body">

        {/* Basic Product Information */}
        <div className="form-section">Basic Information</div>
        
        <div className="form-group">
          <label className="form-label">Product Name <span className="req">*</span></label>
          <input 
            className="form-control-custom" 
            type="text" 
            name="name"
            placeholder="Organic Coffee Beans" 
            value={productForm.name} 
            onChange={handleInputChange} 
            required
          />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Product Type <span className="req">*</span></label>
            <select 
              className="form-control-custom" 
              name="productType"
              value={productForm.productType} 
              onChange={handleInputChange} 
              required
            >
              <option value="">Select type</option>
               {PRODUCT_TYPES.map( (prodType:string)=>{
                const formatLabel = prodType.toLowerCase().replace(/_/g, "")
                .replace(/\b\w/g, (clean)=> clean.toUpperCase());
                return (
                  <option key={prodType} value={prodType}>
                    {formatLabel}
                  </option>
                )
            })}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Unit Type <span className="req">*</span></label>
            <select 
              className="form-control-custom" 
              name="unitType"
              value={productForm.unitType} 
              onChange={handleInputChange} 
              required
            >
              <option value="">Select unit</option>
            {UNIT_TYPES.map( (unit:string)=>{
                const formatLabel = unit.toLowerCase().replace(/_/g, "")
                .replace(/\b\w/g, (clean)=> clean.toUpperCase());
                return (
                  <option key={unit} value={unit}>
                    {formatLabel}
                  </option>
                )
            })}
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Price per Unit <span className="req">*</span></label>
            <input 
              className="form-control-custom" 
              type="number" 
              name="pricePerUnit"
              placeholder="29.99" 
              min="0" 
              step="0.01"
              value={productForm.pricePerUnit || ""} 
              onChange={handleInputChange} 
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Currency <span className="req">*</span></label>
            <select 
              className="form-control-custom" 
              name="currency"
              value={productForm.currency} 
              onChange={handleInputChange} 
              required
            >
              {CURRENCIES.map((currency:string)=> {
                  return(
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  )
              })}
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Stock Quantity <span className="req">*</span></label>
            <input 
              className="form-control-custom" 
              type="number" 
              name="stock"
              placeholder="100" 
              min="0"
              value={productForm.stock || ""} 
              onChange={handleInputChange} 
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Expiration Date</label>
            <input 
              className="form-control-custom" 
              type="date" 
              name="expirationDate"
              value={productForm.expirationDate} 
              onChange={handleInputChange} 
            />
      
          </div>
        </div>

        {/* Product Description */}
        <div className="form-section">Description</div>
        
        <div className="form-group">
          <label className="form-label">Product Description</label>
          <textarea 
            className="form-control-custom" 
            name="description"
            placeholder="Detailed description of the product..."
            rows={4}
            value={productForm.description} 
            onChange={handleInputChange}
          />
        </div>

          <>
            <div className="form-section">Company Information</div>
            
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input 
                className="form-control-custom" 
                type="text" 
                name="companyName"
                placeholder={companyName}
                readOnly
              />
            </div>
          </>
      </div>

      <div className="modal-footer">
        <button className="btn-secondary-custom" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-primary-custom" type="submit" disabled={loading}>
          {loading ? "Saving..." : <><i className="bi bi-check2"></i> Save Product</>}
        </button>
      </div>

    </div>
  </div>
</form>
    )

}

export default AddProductModal;