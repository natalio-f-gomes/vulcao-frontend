import React, { useEffect, useState } from "react";
import { UserProfileModel, AddressModel, CartItem } from "../../../../api/interfaces";
import {
  getUserProfileData, 
  updateUserAddress,
  updateUserProfile,
  updateUserContact, 
  updateCredentials} from "../../../../api/requests";
import { useUserAuthManager } from "../../../../api/authentication-handler";

import {  data, useNavigate } from "react-router-dom";



export interface UserProfile {
  firstName:    string;
  lastName:     string;
}

export interface UserContact {
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
  password: string
}



function GetUserDashBoard() {
  const { isEntityLoggedIn, logoutHandler } = useUserAuthManager();
  const navigate = useNavigate();

  const [user, setUser]                     = useState<UserProfileModel | null>(null);
  const [userProfile, setUserProfile]       = useState<UserProfile>({firstName: "", lastName:""});
  const [userContact, setUserContact]       = useState<UserContact>({email: "", phoneNumber:""});
  const [userAddress, setUserAddress]       = useState<AddressModel>({island: "", city:"", zone:"", street:"", postalCode:""});
  const [loading, setLoading]               = useState<boolean>(true);
  const [userCart, setUserCart] = useState<CartItem[]>([]);
  const [error, setError]                   = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>("");
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
    password: ""

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
          password: ""
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
      
      closeEditingSection("Perfil atualizado com sucesso!");
    } else {
      alert("Falha ao atualizar as informações do perfil.");
    }

  } else if (section === "contact") {
    dataToUpdate = { email: formData.email, phoneNumber: formData.phoneNumber };
    const response = await updateUserContact(user.id, dataToUpdate);
    
    if (response.status === 200) {
      setUserContact({ email: formData.email, phoneNumber: formData.phoneNumber });
      setUser(prev => prev ? { ...prev, ...dataToUpdate } : null);
      
      closeEditingSection("Contacto atualizado com sucesso!");
    } else {
      alert("Falha ao atualizar as informações de contacto.");
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
      
      closeEditingSection("Morada atualizada com sucesso!");
    } else {
      alert("Falha ao atualizar as informações de morada.");
    }

  } else if (section === "security") {
    dataToUpdate = { username: formData.username, password: formData.password };
    const response = await updateCredentials(user.id, dataToUpdate);
    
    if (response.status === 200) {
      setUser({ ...dataToUpdate });
      setUser(prev => prev ? { ...prev, username: { ...dataToUpdate.username } } : null);
      dataToUpdate.password = ""
      closeEditingSection("Credenciais atualizadas com sucesso!Por causa de segurança tens que iniciar sessão mais uma vez!");
      handleLogout()
      
    }
    else if(response.status === 409 || response.status === 403 || response.status === 400){
       alert("Este nome do usuario não está disponivel. E o nome do usuario e a palavra passe tem que ter pelo menos 8 letras");
        dataToUpdate.password = ""
    }
    else {
      alert("Falha ao atualizar as credenciais. Por favor contacta o administrador do website!");
    }

  }
} catch (err) {
  console.error("Erro ao atualizar a secção do perfil:", err);
  alert("Ocorreu um erro inesperado ao guardar as alterações.");
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
  <main className="profile-main">
    <div className="page-header">
      <p className="page-eyebrow">Conta</p>
      <h1 className="page-title">O Meu Perfil</h1>
    </div>

    {/* ── Informação Pessoal ──────────────────────────────────────────────── */}
    <div className="profile-section" id="section-personal">
      <div className="section-head">
        <div className="section-head-left">
          <i className="bi bi-person-fill"></i>
          <span className="section-head-title">Informação Pessoal</span>
        </div>
        <button
          className={`btn-edit ${isEditing("personal") ? "editing" : ""}`}
          onClick={() => isEditing("personal") ? cancelEditing() : startEditing("personal")}
        >
          <i className="bi bi-pencil"></i> {isEditing("personal") ? "Cancelar" : "Editar"}
        </button>
      </div>

      <div className="fields-grid">
        <div className={`field-group ${isEditing("personal") ? "is-editing" : ""}`}>
          <span className="field-label">Primeiro Nome</span>
          <span className="field-value">{formData.firstName || "Não definido"}</span>
          <input className="field-input" id="inp-firstName" type="text"
            value={formData.firstName} onChange={handleInputChange} />
        </div>
        <div className={`field-group ${isEditing("personal") ? "is-editing" : ""}`}>
          <span className="field-label">Último Nome</span>
          <span className="field-value">{formData.lastName || "Não definido"}</span>
          <input className="field-input" id="inp-lastName" type="text"
            value={formData.lastName} onChange={handleInputChange} />
        </div>
      </div>

      {isEditing("personal") && (
        <div className="save-bar visible">
          <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
          <button className="btn-save" onClick={() => saveSection("personal")}>
            <i className="bi bi-check2"></i> Salvar Alterações
          </button>
        </div>
      )}
    </div>

    {/* ── Contacto ────────────────────────────────────────────────────── */}
    <div className="profile-section" id="section-contact">
      <div className="section-head">
        <div className="section-head-left">
          <i className="bi bi-envelope-fill"></i>
          <span className="section-head-title">Detalhes de Contacto</span>
        </div>
        <button
          className={`btn-edit ${isEditing("contact") ? "editing" : ""}`}
          onClick={() => isEditing("contact") ? cancelEditing() : startEditing("contact")}
        >
          <i className="bi bi-pencil"></i> {isEditing("contact") ? "Cancelar" : "Editar"}
        </button>
      </div>

      <div className="fields-grid">
        <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
          <span className="field-label">Endereço de Email</span>
          <span className="field-value">{formData.email || "Não definido"}</span>
          <input className="field-input" id="inp-email" type="email"
            value={formData.email} onChange={handleInputChange} />
        </div>
        <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
          <span className="field-label">Número de Telefone</span>
          <span className="field-value">{formData.phoneNumber || "Não definido"}</span>
          <input className="field-input" id="inp-phoneNumber" type="tel"
            value={formData.phoneNumber} onChange={handleInputChange} />
        </div>
      </div>

      {isEditing("contact") && (
        <div className="save-bar visible">
          <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
          <button className="btn-save" onClick={() => saveSection("contact")}>
            <i className="bi bi-check2"></i> Salvar Alterações
          </button>
        </div>
      )}
    </div>

    {/* ── Morada ────────────────────────────────────────────────────── */}
    <div className="profile-section" id="section-address">
      <div className="section-head">
        <div className="section-head-left">
          <i className="bi bi-geo-alt-fill"></i>
          <span className="section-head-title">Morada</span>
        </div>
        <button
          className={`btn-edit ${isEditing("address") ? "editing" : ""}`}
          onClick={() => isEditing("address") ? cancelEditing() : startEditing("address")}
        >
          <i className="bi bi-pencil"></i> {isEditing("address") ? "Cancelar" : "Editar"}
        </button>
      </div>

      <div className="fields-grid triple">
        <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
          <span className="field-label">Ilha</span>
          <span className="field-value">{formData.island || "Não definido"}</span>
          <input className="field-input" id="inp-island" type="text"
            value={formData.island} onChange={handleInputChange} />
        </div>
        <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
          <span className="field-label">Cidade</span>
          <span className="field-value">{formData.city || "Não definido"}</span>
          <input className="field-input" id="inp-city" type="text"
            value={formData.city} onChange={handleInputChange} />
        </div>
        <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
          <span className="field-label">Zona</span>
          <span className="field-value">{formData.zone || "Não definido"}</span>
          <input className="field-input" id="inp-zone" type="text"
            value={formData.zone} onChange={handleInputChange} />
        </div>
        <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
          <span className="field-label">Código Postal</span>
          <span className="field-value">{formData.postalCode || "Não definido"}</span>
          <input className="field-input" id="inp-postalCode" type="text"
            value={formData.postalCode} onChange={handleInputChange} />
        </div>
        <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
          <span className="field-label">Rua</span>
          <span className="field-value">{formData.street || "Não definido"}</span>
          <input className="field-input" id="inp-street" type="text"
            value={formData.street} onChange={handleInputChange} />
        </div>
      </div>

      {isEditing("address") && (
        <div className="save-bar visible">
          <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
          <button className="btn-save" onClick={() => saveSection("address")}>
            <i className="bi bi-check2"></i> Salvar Alterações
          </button>
        </div>
      )}
    </div>

    {/* ── Segurança ───────────────────────────────────────────────────── */}
    <div className="profile-section" id="section-security">
      <div className="section-head">
        <div className="section-head-left">
          <i className="bi bi-shield-lock-fill"></i>
          <span className="section-head-title">Segurança</span>
        </div>
        <button
          className={`btn-edit ${isEditing("security") ? "editing" : ""}`}
          onClick={() => isEditing("security") ? cancelEditing() : startEditing("security")}
        >
          <i className="bi bi-pencil"></i> {isEditing("security") ? "Cancelar" : "Editar"}
        </button>
      </div>

      <div className="fields-grid">
        <div className={`field-group ${isEditing("security") ? "is-editing" : ""}`}>
          <span className="field-label">Nome de Utilizador</span>
          <span className="field-value">{formData.username || "Não definido"}</span>
          <input className="field-input" id="inp-username" type="text"
            value={formData.username} onChange={handleInputChange} />
        </div>
        <div className={`field-group ${isEditing("security") ? "is-editing" : ""}`}>
          <span className="field-label">Palavra-passe</span>
          <span className="field-value"><span className="pwd-dots">●●●●●●●●●●●●</span></span>
          <input className="field-input" id="inp-password" type="password"
            placeholder="Nova palavra-passe" onChange={handleInputChange} />
        </div>
      </div>

      {isEditing("security") && (
        <div className="save-bar visible">
          <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
          <button className="btn-save" onClick={() => saveSection("security")}>
            <i className="bi bi-check2"></i> Atualizar Credenciais
          </button>
        </div>
      )}
    </div>
  </main>
</div>
  );
}

export default GetUserDashBoard;