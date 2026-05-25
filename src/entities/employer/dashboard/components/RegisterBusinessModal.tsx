import { useState } from "react";
import { AddressModel, CompanyRegistrationModel, EmployerModel } from "../../../../api/interfaces";
import { getEmployerProfile, registerCompany } from "../../../../api/requests";
import { BUSINESS_CATEGORIES } from "../../../../api/categories";

interface Properties {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function RegisterBusinessModal({ isOpen, onClose, onSuccess}: Properties) {
    const username = localStorage.getItem("username")
    const [companyRegistrationForm, setCompanyRegistrationForm] = useState<CompanyRegistrationModel>(
        {
            name:"",
            category: null,
            taxIdNumber:"",
            description:"",
            phoneNumber:"",
            faxNumber:"",
            email:"",
            address:{
                island: "",
                city:"",
                zone:"",
                street: "",
                postalCode:""
            },
            status: null,

            creatorUsername: username!,
            revenue:0
        }
    )

    const [error, setError] = useState<string | null>(null);
    const [loading,setLoadiong] = useState<boolean>(false);

    const addressFields = ["island", "city", "zone", "street", "postalCode"];

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        ) => {
        const { name, value } = event.target;

        if (addressFields.includes(name)) {
            setCompanyRegistrationForm((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
            }));
        } else {
            setCompanyRegistrationForm((prev) => ({
            ...prev,
            [name]: value,
            }));
        }
        };

    const handleApiCall = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoadiong(true);
        try{
            console.log("Company data: ", companyRegistrationForm)
            const response = await registerCompany(companyRegistrationForm);
            console.log(response)
            if(response.status === 201){
                alert("Company Successfully Registered")
                onSuccess();
                onClose()
            }else if(response.status === 409){
                 alert("A Company with the same Tax ID Number or email alreeady Exists")
            }else if(response.status === 403){
                alert("ACCESS DENIED")
            }
            else if(response.status === 400){
                alert("Please make sure to fill in all of the values and select the company status")
            }
        }catch(error){
            setError(`Registration failed ${error}`)
            console.log(error)
        }finally{setLoadiong(false)}

    }

  if (!isOpen) return null; // like @ConditionalOnProperty — only renders when needed

  return (
    <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">Register a New Business</span>
          <button className="m-close" onClick={onClose}>&times;</button>
        </div>
        <form id="companyRegistrationForm" onSubmit={handleApiCall}>    
            <div className="m-body">
                <div className="m-row">
                    <div className="m-field">
                    <label className="m-label">Business Name *</label>
                    <input className="m-input" type="text" placeholder="e.g. ShopLane Boutique" name="name" value={companyRegistrationForm.name} onChange={handleInputChange}/>
                    </div>
                <div className="m-field">
                <label className="m-label">Category *</label>
                <select 
                        className="form-select" 
                        id="type" 
                        name="category" 
                        value={companyRegistrationForm.category ?? ""} 
                        onChange={handleInputChange}
                    >
                        <option value="">Select Category</option>
                        {BUSINESS_CATEGORIES.map((cat: string) => {
                        // Formats "FAST_FOOD" -> "Fast Food", "AI_ML_COMPANY" -> "Ai Ml Company"
                        const formattedLabel = cat
                            .toLowerCase()
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase());

                        return (
                            <option key={cat} value={cat}>
                            {formattedLabel}
                            </option>
                        );
                        })}
                    </select>
                </div>
            </div>

            <div className="m-field">
                <label className="m-label">Description</label>
                <textarea className="m-textarea" name="description" placeholder="Brief description..." required value={companyRegistrationForm.description} onChange={handleInputChange}></textarea>
            </div>
                  <div className="m-row">
                        <div className="m-field">
                        <label className="m-label">Tax Identification Number</label>
                          <input className="m-input" type="tel" name="taxIdNumber" placeholder="123-232434233" required value={companyRegistrationForm.taxIdNumber} onChange={handleInputChange} />
                        </div>
                        <div className="m-field">
                        <label className="m-label">Fax Number</label>
                         <input className="m-input" type="tel" name="faxNumber" placeholder="123-232434233" required value={companyRegistrationForm.faxNumber} onChange={handleInputChange} />
                        </div>
                    </div>

            <div className="m-row">
                <div className="m-field">
                <label className="m-label">Phone</label>
                <input className="m-input" type="tel" name="phoneNumber" placeholder="+1 (555) 000-0000" required value={companyRegistrationForm.phoneNumber} onChange={handleInputChange} />
                </div>
                <div className="m-field">
                <label className="m-label">Email</label>
                <input className="m-input" type="email" name="email" placeholder="business@example.com" value={companyRegistrationForm.email} onChange={handleInputChange} />
                </div>
            </div>

            <div className="m-field row">

                <div className="m-field col-6" >
                    <label className="m-label">Revenue</label>
                    <input className="m-input" type="number" name="revenue" placeholder="e.g. 100000 " required value={companyRegistrationForm.revenue} onChange={handleInputChange}/>
                </div>
                <div className="col-6">
                    <label className="m-label">Status *</label>
                    <select className="m-select form-select" name="status" id="status" value={companyRegistrationForm.status?? ""} onChange={handleInputChange}>
                    <option value="">STATUS</option>
                    <option value={"OPERATING"}>OPERATING</option>
                    <option value={"INACTIVE"}>INACTIVE</option>
                    <option value={"CLOSED"}>CLOSED</option>
                    </select>
                </div>

            </div>

            <div className="m-field">
                <label className="m-label"><i className="bi bi-geo-alt-fill me-1"></i> Address</label>
            </div>
            <div className="m-row">
                <div className="m-field">
                <label className="m-label">Island</label>
                <input className="m-input" type="text" name="island" placeholder="e.g. Santiago" required value={companyRegistrationForm.address.island} onChange={handleInputChange}/>
                </div>
                <div className="m-field">
                <label className="m-label">City</label>
                <input className="m-input" type="text" name="city" placeholder="e.g. Praia" value={companyRegistrationForm.address.city} onChange={handleInputChange}/>
                </div>
            </div>
            <div className="m-row">
                <div className="m-field">
                <label className="m-label">Zone</label>
                <input className="m-input" type="text" name="zone" placeholder="e.g. Plateau" value={companyRegistrationForm.address.zone} onChange={handleInputChange} />
                </div>
                <div className="m-field">
                <label className="m-label">Postal Code</label>
                <input className="m-input" type="text" name="postalCode" placeholder="e.g. 7600" value={companyRegistrationForm.address.postalCode} onChange={handleInputChange}/>
                </div>
            </div>
            <div className="m-field">
                <label className="m-label">Street</label>
                <input className="m-input" type="text" name="street" placeholder="e.g. Rua do Município" value={companyRegistrationForm.address.street} onChange={handleInputChange}/>
            </div>

            <div className="m-footer">
                <button className="m-btn-cancel" onClick={onClose}>Cancel</button>
                <button className="m-btn-save" type="submit">
                <i className="bi bi-check2"></i> Save Business
                </button>
            </div>
            </div>
         </form>
      </div>
    </div>
  );
}

export default RegisterBusinessModal;