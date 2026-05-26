import React, { useEffect, useState } from "react";
import GetHeader from "../../components/header";
import GetFooterSection from "../../components/footer";
import { UserProfileModel, AddressModel} from "../../api/interfaces";
import { getUserProfileData, updateUserAddress, updateUserProfile , updateUserContact } from "../../api/requests";
import { useUserAuthManager } from "../../api/authentication-handler";
import { Link, useNavigate } from "react-router-dom";


interface UserProfile {
  firstName:    string;
  lastName:     string;
}

interface UserContact {
  email:    string;
  phoneNumber:     string;
}


interface FormData {
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
}

function GetUserAccountPage() {
  const { isEntityLoggedIn, logoutHandler } = useUserAuthManager();
  const navigate = useNavigate();

  const [user, setUser]                     = useState<UserProfileModel | null>(null);
  const [userProfile, setUserProfile]       = useState<UserProfile>({firstName: "", lastName:""});
  const [userContact, setUserContact]       = useState<UserContact>({email: "", phoneNumber:""});
  const [userAddress, setUserAddress]       = useState<AddressModel>({island: "", city:"", zone:"", street:"", postalCode:""});
  const [loading, setLoading]               = useState<boolean>(true);
  const [error, setError]                   = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null); // which section is open
  const [formData, setFormData]             = useState<FormData>({
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
  });

  // ── Redirect if not logged in (@PreAuthorize equivalent) ──────────────────
  useEffect(() => {
    if (!isEntityLoggedIn) navigate("/user-login");
  }, [isEntityLoggedIn]);

  // ── Fetch profile on mount (@PostConstruct equivalent) ────────────────────
  useEffect(() => {   
    getUserProfileData()
      .then((data) => {
        setUser(data);
        // Populate form with existing values — like calling BeanUtils.copyProperties()
        setFormData({
          firstName:   data?.firstName   || "",
          lastName:    data?.lastName    || "",
          email:       data?.email       || "",
          phoneNumber: data?.phoneNumber || "",
          island:      data?.address?.island      || "",
          city:        data?.address?.city        || "",
          zone:        data?.address?.zone        || "",
          postalCode:  data?.address?.postalCode  || "",
          street:      data?.address?.street      || "",
          username:    data?.username    || "",
        });
      })
      .catch((err) => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  // ── Generic input handler — works for ALL fields ───────────────────────────
  // id format is "inp-fieldName" so we strip the prefix to get the key
  // Like a generic setter: formData.put(fieldName, value)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
    setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };

  const startEditing  = (section: string) => setEditingSection(section);
  const cancelEditing = ()                 => setEditingSection(null);
  const isEditing     = (section: string) => editingSection === section;

  const closeEditingSection = (alertMessage: string) => {setEditingSection(null); alert(alertMessage)};
  // ── Save a specific section ────────────────────────────────────────────────
  // Like a @PatchMapping — only sends the changed fields, not the whole object
    // ── Save a specific section ────────────────────────────────────────────────
  const saveSection = async (section: string) => {
    if (!user?.username) return;

    let dataToUpdate: any = {};

    try {
      if (section === "personal") {
        dataToUpdate = { firstName: formData.firstName, lastName: formData.lastName };
        const response = await updateUserProfile(user.id, dataToUpdate);
        
        if (response.status === 200) {
          setUserProfile({ firstName: formData.firstName, lastName: formData.lastName });
          setUser(prev => prev ? { ...prev, ...dataToUpdate } : null);
          
          closeEditingSection("Profile updated successfully!");
        } else {
          alert("Failed to update profile info.");
        }

      } else if (section === "contact") {
        dataToUpdate = { email: formData.email, phoneNumber: formData.phoneNumber };
        const response = await updateUserContact(user.id, dataToUpdate);
        
        if (response.status === 200) {
          setUserContact({ email: formData.email, phoneNumber: formData.phoneNumber });
          setUser(prev => prev ? { ...prev, ...dataToUpdate } : null);
          
          closeEditingSection("User Contact updated successfully!");
        } else {
          alert("Failed to update contact info.");
        }

      } else if (section === "address") {
        dataToUpdate = {
          island:     formData.island,
          city:       formData.city,
          zone:       formData.zone,
          postalCode: formData.postalCode,
          street:     formData.street,
        };
        const response = await updateUserAddress(user.id, dataToUpdate);
        
        if (response.status === 200) {
          setUserAddress({ ...dataToUpdate });
          setUser(prev => prev ? { ...prev, address: { ...dataToUpdate } } : null);
          
          closeEditingSection("User Address updated successfully!");
        } else {
          alert("Failed to update address info.");
        }

      } else if (section === "security") {
        dataToUpdate = { username: formData.username };
        //todo later when deploying
      }
    } catch (err) {
      console.error("Error updating profile section:", err);
      alert("An unexpected error occurred while saving.");
    }
  };

  // ── Handle logout button in sidebar ───────────────────────────────────────
  const handleLogout = async () => {
    await logoutHandler();
    navigate("/");
  };


  if (loading) return <div>Loading profile...</div>;
  if (error)   return <div>Error: {error}</div>;
  if (!user)   return <div>No user data found.</div>;

  return (
    <div>
      <GetHeader />
      <div className="profile-page">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="profile-sidebar">
          <div className="avatar-ring">
            <i className="bi bi-person"></i>
          </div>
          <p className="sidebar-name">{user.username || "Guest"}</p>
          <p className="sidebar-id">ID: {user.id || "N/A"}</p>
          <div className="sidebar-divider"></div>

          <nav className="sidebar-nav">
            <a href="#section-personal" className="sidebar-nav-item active">
              <i className="bi bi-person"></i> Personal Info
            </a>
            <a href="#section-contact" className="sidebar-nav-item">
              <i className="bi bi-envelope"></i> Contact
            </a>
            <a href="#section-address" className="sidebar-nav-item">
              <i className="bi bi-geo-alt"></i> Address
            </a>
            <Link to="/user-cart" className="sidebar-nav-item">
              <i className="bi bi-cart-fill"></i> Cart
            </Link>
            <a href="#section-contact" className="sidebar-nav-item">
              <i className="bi bi-bag-fill"></i> Orders
            </a>
            <a href="#section-security" className="sidebar-nav-item">
              <i className="bi bi-shield-lock"></i> Security
            </a>
          </nav>

          <div className="sidebar-logout">
            <button className="btn-logout" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
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
                <i className="bi bi-pencil"></i> {isEditing("security") ? "Cancel" : "Change Credentials"}
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
      <GetFooterSection />
    </div>
  );
}

export default GetUserAccountPage;