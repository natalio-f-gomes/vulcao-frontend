import { useNavigate } from "react-router-dom";
import { useUserAuthManager } from "../../../../api/authentication-handler";
import { AddressModel, CompanyModel, EmployerModel, StaffModel, UserProfileModel } from "../../../../api/interfaces";
import { useEffect, useState } from "react";
import { UserContact, UserProfile } from "../../../user/user-account/views/UserDashboard";
import { getEmployerProfile, updateEmployerAddress, updateEmployerContact, updateEmplyerProfile } from "../../../../api/requests";



interface EmployerAccountForm {
  firstName:    string;
  lastName:     string;
  email:        string;
  phoneNumber:  string;
  island:       string;
  city:         string;
  zone:         string;
  postalCode:   string;
  street:       string;
  username:     string;
  companiesRegistered: CompanyModel[];
}



function EmployerProfileView(){
    const {isEntityLoggedIn, logoutHandler} = useUserAuthManager();
    const navigate = useNavigate();
    const [employer, setEmployer]                     = useState<EmployerModel | null>(null);
    const [employerProfile, setEmployerProfile]       = useState<UserProfile>({firstName: "", lastName:""});
    const [employerContact, setEmployerContact]       = useState<UserContact>({email: "", phoneNumber:""});
    const [employerAddress, setemployerAddress]       = useState<AddressModel>({island: "", city:"", zone:"", street:"", postalCode:""});
    const [loading, setLoading]               = useState<boolean>(true);
    const closeEditingSection = (alertMessage: string) => {setEditingSection(null); alert(alertMessage)};
    const [error, setError]                   = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<string>("");
    const [editingSection, setEditingSection] = useState<string | null>(null); // which section is open
    const [formData, setFormData]             = useState<EmployerAccountForm>({
        firstName:   "",
        lastName:    "",
        email:       "",
        phoneNumber: "",
        island:      "",
        city:        "",
        zone:        "",
        postalCode:  "",
        street:      "",
        username:    "",
        companiesRegistered: []
    });

    useEffect(()=> {
        if(!isEntityLoggedIn) navigate("/employer/login");
    }, [isEntityLoggedIn]);

    // ── Fetch profile on mount (@PostConstruct equivalent) ────────────────────
      useEffect(() => {   
        getEmployerProfile()
          .then((data) => {
            setEmployer(data);
            // Populate form with existing values — like calling BeanUtils.copyProperties()
            setFormData({
              firstName:   data?.firstName   || "",
              lastName:    data?.lastName    || "",
              email:       data?.email       || "",
              phoneNumber: data?.phoneNumber || "",
              island:      data?.address?.island     || "",
              city:        data?.address?.city        || "",
              zone:        data?.address?.zone        || "",
              postalCode:  data?.address?.postalCode  || "",
              street:      data?.address?.street      || "",
              username:    data?.username    || "",
              companiesRegistered: data?.companiesRegistered || [],
            });
          })
          .catch((err) => setError(err.message || "Failed to load profile"))
          .finally(() => setLoading(false));
    
      }, []);

       const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
          setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }));
        };

        const startEditing  = (section: string) => setEditingSection(section);
        const cancelEditing = ()                 => setEditingSection(null);
        const isEditing     = (section: string) => editingSection === section;

    const saveSection = async (section: string) => {
        if(!employer?.username) return;
        let dataToUpdate: any = {};
        try{
           if(section === "personal"){
            dataToUpdate = {firstName: formData.firstName, lastName: formData.lastName};
            const response = await updateEmplyerProfile(employer.username, dataToUpdate);
            if(response.status === 200){
                setEmployerProfile( {firstName: formData.firstName, lastName: formData.lastName});
                setEmployer(prev => prev ? { ... prev, ...dataToUpdate}: null);    
                closeEditingSection("Profile updated successfully!");
            }else{
                  alert("Failed to update profile info.");
            }
           }else if(section === "contact"){
            dataToUpdate = { email: formData.email, phoneNumber: formData.phoneNumber };
            const response = await updateEmployerContact(employer.username, dataToUpdate);
            if(response.status === 200){
                setEmployerContact({email: formData.email, phoneNumber: formData.phoneNumber});
                  setEmployer(prev => prev ? { ... prev, ...dataToUpdate}: null);  
                   closeEditingSection("Contact updated successfully!"); 
            }else{
                  alert("Failed to update profile info.");
            }
           }else if (section === "address") {
        dataToUpdate = {
          island:     formData.island,
          city:       formData.city,
          zone:       formData.zone,
          postalCode: formData.postalCode,
          street:     formData.street,
        };
          const response = await updateEmployerAddress(employer.username, dataToUpdate);
                
                if (response.status === 200) {
                  setemployerAddress({ ...dataToUpdate });
                  setEmployer(prev => prev ? { ...prev, address: { ...dataToUpdate } } : null);
                  
                  closeEditingSection("Address updated successfully!");
                } else {
                  alert("Failed to update address info.");
                }


    }else if (section === "security") {
        dataToUpdate = { username: formData.username };
        //todo later when deploying
      }
        }catch(exception){
             console.error("Error updating profile section:", exception);
            alert("An unexpected error occurred while saving.");

        }
    }
      const handleLogout = async () => {
    await logoutHandler();
    navigate("/");
  };
  if (loading) return <div>Loading profile...</div>;
  if (error)   return <div>Error: {error}</div>;
  if (!employer)   return <div>No Employer data found.</div>;

      

    return (
       <div>

        <main className="profile-main">
          <div className="page-header">
            <p className="page-eyebrow">Account</p>
            <h1 className="page-title">My Profile</h1>
          </div>

          {/* ── Personal Info ──────────────────────────────────────────────── */}
          <div className="profile-section" id="section-personal">
            <div className="section-head">
              <div className="section-head-left">
                <i className="bi bi-person-fill"></i>
                <span className="section-head-title">Personal Information</span>
              </div>
              <button
                className={`btn-edit ${isEditing("personal") ? "editing" : ""}`}
                onClick={() => isEditing("personal") ? cancelEditing() : startEditing("personal")}
              >
                <i className="bi bi-pencil"></i> {isEditing("personal") ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="fields-grid">
              <div className={`field-group ${isEditing("personal") ? "is-editing" : ""}`}>
                <span className="field-label">First Name</span>
                <span className="field-value">{formData.firstName || "Not Set"}</span>
                <input className="field-input" id="inp-firstName" type="text"
                  value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className={`field-group ${isEditing("personal") ? "is-editing" : ""}`}>
                <span className="field-label">Last Name</span>
                <span className="field-value">{formData.lastName || "Not Set"}</span>
                <input className="field-input" id="inp-lastName" type="text"
                  value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>

            {isEditing("personal") && (
              <div className="save-bar visible">
                <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                <button className="btn-save" onClick={() => saveSection("personal")}>
                  <i className="bi bi-check2"></i> Save Changes
                </button>
              </div>
            )}
          </div>

          {/* ── Contact ────────────────────────────────────────────────────── */}
          <div className="profile-section" id="section-contact">
            <div className="section-head">
              <div className="section-head-left">
                <i className="bi bi-envelope-fill"></i>
                <span className="section-head-title">Contact Details</span>
              </div>
              <button
                className={`btn-edit ${isEditing("contact") ? "editing" : ""}`}
                onClick={() => isEditing("contact") ? cancelEditing() : startEditing("contact")}
              >
                <i className="bi bi-pencil"></i> {isEditing("contact") ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="fields-grid">
              <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
                <span className="field-label">Email Address</span>
                <span className="field-value">{formData.email || "Not Set"}</span>
                <input className="field-input" id="inp-email" type="email"
                  value={formData.email} onChange={handleInputChange} />
              </div>
              <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
                <span className="field-label">Phone Number</span>
                <span className="field-value">{formData.phoneNumber || "Not Set"}</span>
                <input className="field-input" id="inp-phoneNumber" type="tel"
                  value={formData.phoneNumber} onChange={handleInputChange} />
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
          </div>

          {/* ── Address ────────────────────────────────────────────────────── */}
          <div className="profile-section" id="section-address">
            <div className="section-head">
              <div className="section-head-left">
                <i className="bi bi-geo-alt-fill"></i>
                <span className="section-head-title">Address</span>
              </div>
              <button
                className={`btn-edit ${isEditing("address") ? "editing" : ""}`}
                onClick={() => isEditing("address") ? cancelEditing() : startEditing("address")}
              >
                <i className="bi bi-pencil"></i> {isEditing("address") ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="fields-grid triple">
              <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                <span className="field-label">Island</span>
                <span className="field-value">{formData.island || "Not Set"}</span>
                <input className="field-input" id="inp-island" type="text"
                  value={formData.island} onChange={handleInputChange} />
              </div>
              <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                <span className="field-label">City</span>
                <span className="field-value">{formData.city || "Not Set"}</span>
                <input className="field-input" id="inp-city" type="text"
                  value={formData.city} onChange={handleInputChange} />
              </div>
              <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                <span className="field-label">Zone</span>
                <span className="field-value">{formData.zone || "Not Set"}</span>
                <input className="field-input" id="inp-zone" type="text"
                  value={formData.zone} onChange={handleInputChange} />
              </div>
              <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                <span className="field-label">Postal Code</span>
                <span className="field-value">{formData.postalCode || "Not Set"}</span>
                <input className="field-input" id="inp-postalCode" type="text"
                  value={formData.postalCode} onChange={handleInputChange} />
              </div>
              <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
                <span className="field-label">Street</span>
                <span className="field-value">{formData.street || "Not Set"}</span>
                <input className="field-input" id="inp-street" type="text"
                  value={formData.street} onChange={handleInputChange} />
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
          </div>

          {/* ── Security ───────────────────────────────────────────────────── */}
          <div className="profile-section" id="section-security">
            <div className="section-head">
              <div className="section-head-left">
                <i className="bi bi-shield-lock-fill"></i>
                <span className="section-head-title">Security</span>
              </div>
              <button
                className={`btn-edit ${isEditing("security") ? "editing" : ""}`}
                onClick={() => isEditing("security") ? cancelEditing() : startEditing("security")}
              >
                <i className="bi bi-pencil"></i> {isEditing("security") ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="fields-grid">
              <div className={`field-group ${isEditing("security") ? "is-editing" : ""}`}>
                <span className="field-label">Username</span>
                <span className="field-value">{formData.username || "Not Set"}</span>
                <input className="field-input" id="inp-username" type="text"
                  value={formData.username} onChange={handleInputChange} />
              </div>
              <div className={`field-group ${isEditing("security") ? "is-editing" : ""}`}>
                <span className="field-label">Password</span>
                <span className="field-value"><span className="pwd-dots">●●●●●●●●●●●●</span></span>
                <input className="field-input" id="inp-password" type="password"
                  placeholder="New password" onChange={handleInputChange} />
              </div>
    
            </div>

            {isEditing("security") && (
              <div className="save-bar visible">
                <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                <button className="btn-save" onClick={() => saveSection("security")}>
                  <i className="bi bi-check2"></i> Update Credentials
                </button>
              </div>
            )}
          </div>

         

        </main>
 
    </div>
    );
}

export default EmployerProfileView