import React, { useEffect, useState } from "react";
import { AddressModel, CompanyAboutInfo, CompanyContact, CompanyModel } from "../../../api/interfaces";
import Card from "react-bootstrap/card"
import Button from 'react-bootstrap/Button';
import Table  from "react-bootstrap/Table";
import { useUserAuthManager } from "../../../api/authentication-handler";
import { useNavigate } from "react-router-dom";
import { updateCompanyAboutInfo, updateCompanyAddress, updateCompanyContact } from "../../../api/requests";
interface Parameters{
    company: CompanyModel
}

function InfoRow({ label, value}: { label: string; value?: string | number }) {
  return (
    <div className="info-row" style={{marginTop:5, marginLeft:10, marginRight:10}}>
      <span className="text-dark">{label}</span>
      <span className="text-dark">{value || "—"}</span>
    </div>
  );
}

function CompanyOverView({company}: Parameters){
    const companyStatus = company.status === "OPERATING" ? "status-badge active": "status-badge inactive";
    const {isEntityLoggedIn, logoutHandler} = useUserAuthManager();
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [aboutInfo, setAboutInfo] = useState<CompanyAboutInfo>({
        description: company.description,
        status: company.status
    });
    const [address, setAddress] = useState<AddressModel>({
        island: company.address.island,
        city: company.address.city,
        postalCode: company.address.postalCode,
        street: company.address.street,
        zone: company.address.zone,
    });

    const [contact, setContact] = useState<CompanyContact>({
        email:company.email,
        phoneNumber:company.phoneNumber,
        faxNumber:company.faxNumber,
        taxIdNumber:company.taxIdNumber,
    });
    const navigate = useNavigate();
    useEffect(() => {
        if (!isEntityLoggedIn) navigate("/employer-login");
        
      }, [isEntityLoggedIn]);

        const contactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
          setContact((prev) => ({ ...prev, [fieldName]: e.target.value }));
        };
        const addressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
          setAddress((prev) => ({ ...prev, [fieldName]: e.target.value }));
        };
        
        const aboutInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
          const {name, value} = e.target;
          setAboutInfo((prev) => ({ ...prev, [name]: value }));
        };
        
        const startEditing  = (section: string) => setEditingSection(section);
        const cancelEditing = ()                 => setEditingSection(null);
        const isEditing     = (section: string) => editingSection === section;
        const closeEditingSection = (alertMessage: string) => {setEditingSection(null); alert(alertMessage)};
        
        const saveSection = async (section: string) => {
            if(!company) return;
            let dataToUpdate: any = {};
            try{
                if (section === "address") {
                    dataToUpdate = { island: address.island, city: address.city, street: address.street, zone: address.zone, postalCode: address.postalCode };
                    const response = await updateCompanyAddress(dataToUpdate, company.id! );
                    console.log("Response trying to update the user address: ", response)
                    if (response.status === 200) {
                        setAddress({ island: address.island, city: address.city, street: address.street, zone: address.zone, postalCode: address.postalCode  });
                        
                        closeEditingSection("Company Address updated successfully!");
                    }else if(response.status === 400){
                        alert("At least 1 field contained Invalid Info!")
                    }  else {
                        alert("Failed to update company address");
                    }
                }else if(section === "contact"){
                    dataToUpdate = { email: contact.email, phoneNumber: contact.phoneNumber, taxIdNumber: contact.taxIdNumber, faxNumber: contact.faxNumber };
                    const response = await updateCompanyContact(dataToUpdate, company.id! );
                    console.log("Response trying to update the company contact: ", response)
                    if (response.status === 200) {
                        setContact({  email: contact.email, phoneNumber: contact.phoneNumber, taxIdNumber: contact.taxIdNumber, faxNumber: contact.faxNumber  });
                    
                        closeEditingSection("Company Contact information updated successfully!");
                    }else if(response.status === 400){
                        alert("At least 1 field contained Invalid Info!")
                    }  else {
                        alert("Failed to update company Contact Information");
                    }
                }
                else if(section === "about"){
                    dataToUpdate = { description: aboutInfo.description, status: aboutInfo.status };
                    console.log("Data to Update: ", dataToUpdate)
                    const response = await updateCompanyAboutInfo(company.id!, dataToUpdate );
                    console.log("Response trying to update the company contact: ", response)
                    if (response.status === 200) {
                        setAboutInfo({description: aboutInfo.description, status: aboutInfo.status });
                        closeEditingSection("Company About information updated successfully!");
                    }else if(response.status === 400){
                        alert("At least 1 field contained Invalid Info!")
                    } 
                    else {
                        alert("Failed to update company Contact Information");
                    }
                }
        }catch(exception){
            console.log(`There was an issue updating the company: ${exception}`)
        }

    }
        useEffect(() => {
        if (company) {
            setAddress({
                island: company.address.island || "",
                city: company.address.city || "",
                postalCode: company.address.postalCode || "",
                street: company.address.street || "",
                zone: company.address.zone || "",
            });
            setContact({
                email: company.email || "",
                phoneNumber: company.phoneNumber || "",
                faxNumber: company.faxNumber || "",
                taxIdNumber: company.taxIdNumber || "",
            });
            setAboutInfo({
                description: company.description || "",
                status: company.status
            });
        }
    }, [company]);

    return (

        <div className="container-fluid px-3"> 

        <div className="main-content">
            <Card style={{ width:"100%" }} className="rounded mb-3">
                <Card.Body>
                    {/* Added responsive text utility classes to scale text on mobile */}
                    <Card.Title> <h1 className="fs-3 fs-md-1 text-wrap">{company.name}</h1></Card.Title>
                    <Card.Subtitle 
                        style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}
                    >
                        <small className={companyStatus}>{company.status}</small>
                        <span>{company.category}</span>
                    </Card.Subtitle>
                </Card.Body>
            </Card>

            <div className="row g-3 mt-2">
                <div className="col-12 col-md-6">
                    <Card style={{ width:"100%" }} className="rounded h-100">
                        <Card.Body>
                             <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title className="mb-0"> 
                                    <h1 className="fs-4 fs-md-2 text-wrap mb-0">Contact</h1>
                                </Card.Title>
                                 <button
                                    className={`btn-edit ${isEditing("contact") ? "editing" : ""}`}
                                    onClick={() => isEditing("contact") ? cancelEditing() : startEditing("contact")}
                                >
                                    <i className="bi bi-pencil"></i> {isEditing("contact") ? "Cancel" : "Edit"}
                                </button>
                            </div>
                            <hr />
                             <div className="fields-grid">
                                <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
                                    <span className="field-label">Phone Number</span>
                                    <span className="field-value">{contact.phoneNumber || "Not Set"}</span>
                                    <input className="field-input" id="inp-phoneNumber" type="text"
                                        value={contact.phoneNumber} onChange={contactInputChange} />
                                </div>
                                <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
                                    <span className="field-label">Email</span>
                                    <span className="field-value">{contact.email || "Not Set"}</span>
                                    <input className="field-input" id="inp-email" type="email"
                                        value={contact.email} onChange={contactInputChange} />
                                </div>
                                    <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
                                    <span className="field-label">Fax Number</span>
                                    <span className="field-value">{contact.faxNumber || "Not Set"}</span>
                                    <input className="field-input" id="inp-faxNumber" type="text"
                                        value={contact.faxNumber} onChange={contactInputChange} />
                                </div>
                                    <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
                                    <span className="field-label">Tax Id Number</span>
                                    <span className="field-value">{contact.taxIdNumber || "Not Set"}</span>
                                    <input className="field-input" id="inp-taxIdNumber" type="text"
                                        value={contact.taxIdNumber} onChange={contactInputChange} />
                                </div>
                            </div>
                            {isEditing("contact") && (
                            <div className="save-bar visible">
                                    <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                                    <button className="btn-save" onClick={() => saveSection("contact")}>
                                    <i className="bi bi-check2"></i> Save Changes
                                    </button>
                                </div>
                                )}

                        </Card.Body>
                    </Card>
                </div>

                <div className="col-12 col-md-6">
                     <Card style={{ width:"100%" }} className="rounded h-100">
                        <Card.Body>
                             <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title className="mb-0"> 
                                    <h1 className="fs-4 fs-md-2 text-wrap mb-0">Address</h1>
                                </Card.Title>
                                 <button
                                    className={`btn-edit ${isEditing("address") ? "editing" : ""}`}
                                    onClick={() => isEditing("address") ? cancelEditing() : startEditing("address")}
                                >
                                    <i className="bi bi-pencil"></i> {isEditing("address") ? "Cancel" : "Edit"}
                                </button>
                            </div>
                            <hr />
                             <div className="fields-grid">
                                <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                                    <span className="field-label">Island</span>
                                    <span className="field-value">{address.island || "Not Set"}</span>
                                    <input className="field-input" id="inp-island" type="text"
                                        value={address.island} onChange={addressInputChange} />
                                </div>
                                  <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                                    <span className="field-label">City</span>
                                    <span className="field-value">{address.city || "Not Set"}</span>
                                    <input className="field-input" id="inp-city" type="text"
                                        value={address.city} onChange={addressInputChange} />
                                </div>
                                    <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                                    <span className="field-label">Zone</span>
                                    <span className="field-value">{address.zone || "Not Set"}</span>
                                    <input className="field-input" id="inp-zone" type="text"
                                        value={address.zone} onChange={addressInputChange} />
                                </div>
                                <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                                    <span className="field-label">Postal Code</span>
                                    <span className="field-value">{address.postalCode || "Not Set"}</span>
                                    <input className="field-input" id="inp-postalCode" type="text"
                                        value={address.postalCode} onChange={addressInputChange} />
                                </div>
                                    <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                                    <span className="field-label">Street</span>
                                    <span className="field-value">{address.street || "Not Set"}</span>
                                    <input className="field-input" id="inp-street" type="text"
                                        value={address.street} onChange={addressInputChange} />
                                </div>
                            </div>
                                    {isEditing("address") && (
                                    <div className="save-bar visible">
                                            <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                                            <button className="btn-save" onClick={() => saveSection("address")}>
                                            <i className="bi bi-check2"></i> Save Changes
                                            </button>
                                        </div>
                                        )}

                        </Card.Body>
                    </Card>
                </div>
                 <div className="col-12 col-md-12">
                    <Card style={{ width:"100%" }} className="rounded h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title className="mb-0"> 
                                    <h1 className="fs-4 fs-md-2 text-wrap mb-0">About</h1>
                                </Card.Title>
                                 <button
                                    className={`btn-edit ${isEditing("about") ? "editing" : ""}`}
                                    onClick={() => isEditing("about") ? cancelEditing() : startEditing("about")}
                                    >
                                    <i className="bi bi-pencil"></i> {isEditing("about") ? "Cancel" : "Edit"}
                                </button>
                            </div>
                            <hr />
                           <div className="fields-grid">
                                <div className={`field-group ${isEditing("about") ? "is-editing" : ""}`}>
                                    <span className="field-label">Description</span>
                                    <span className="field-value text-wrap"  style={{ whiteSpace: 'pre-wrap' }}>
                                        {aboutInfo.description || "No description provided."}
                                    </span>
                                    <textarea className="field-input" name="description" style={{width:'100%'}} id="inp-description" rows={10}
                                        value={aboutInfo.description} onChange={aboutInfoChange} />
                                </div>
                            </div>
                            <hr />
                             <div className="fields-grid">
                                <div className={`field-group ${isEditing("about") ? "is-editing" : ""}`}>
                                    <span className="field-label">Status</span>
                                    <span className="field-value text-wrap" style={{ whiteSpace: 'pre-wrap' }}>
                                        {aboutInfo.status || "No description provided."}
                                    </span>
                                    <select name="status" 
                                    id="inp-status"
                                     className="field-input"
                                      value={aboutInfo.status as string}
                                      onChange={aboutInfoChange}
                                      >
                                        <option value="" disabled>Select Status...</option>
                                        <option value="OPERATING">OPERATING</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                        <option value="CLOSED">CLOSED</option>

                                      </select>
                                </div>
                            </div>
                                 {isEditing("about") && (
                                    <div className="save-bar visible">
                                            <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                                            <button className="btn-save" onClick={() => saveSection("about")}>
                                            <i className="bi bi-check2"></i> Save Changes
                                            </button>
                                        </div>
                                        )}
                        

                        </Card.Body>
                    </Card>
                </div>
                  <div className="col-12 col-md-12">
                    <Card style={{ width:"100%" }} className="rounded h-100">
                        <Card.Body>
                            <Card.Title> <h1 className="fs-4 fs-md-2 text-wrap">Updates</h1></Card.Title>
                            <Card.Subtitle 
                                style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}
                            >
                            </Card.Subtitle>
                            <hr />
                            <InfoRow label="Created At" value={company.createdAt} />
                            <InfoRow label="Updated AT" value={company.updatedAt} />

                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    </div>
    )
}

export default CompanyOverView