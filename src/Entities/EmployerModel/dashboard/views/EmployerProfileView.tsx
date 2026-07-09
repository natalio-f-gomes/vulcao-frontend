import { useNavigate } from "react-router-dom";
import {
  AddressModel,
  COUNTRIES,
  Country,
  ISLAND,
  ISLANDS,
} from "../../../../Interfaces/global";
import { useUserAuthManager } from "../../../../Auth/Auth-Handler";
import { ProfileModel } from "../../../../Interfaces/Authentication";
import { useEffect, useState } from "react";
import { getEmployerProfileData } from "../../../../Requests/employer";
import {
  updateAddress,
  updateContact,
  updateCredentials,
  updateName,
} from "../../../../Requests/global";
import {
  isEmailValid,
  isNameValid,
  isPasswordValid,
  isUsernameValid,
} from "../../../../Validators/Authentication";
import {
  isAddressValid,
  isPhoneNumberValid,
} from "../../../../Validators/Gloabal";

interface EmployerAccountForm {
  state: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: Country;
  island: string;
  city: string;
  zone: string;
  postalCode: string;
  street: string;
  username: string;
  password: string;
}

function EmployerProfileView() {
  const {
    isEntityLoggedIn,
    logoutHandler,
    isLoading: authLoading,
  } = useUserAuthManager();

  const navigate = useNavigate();
  const [employer, setEmployer] = useState<ProfileModel | null>(null);
  const [employerName, setEmployerName] = useState<{
    firstName: string;
    lastName: string;
  }>({
    firstName: "",
    lastName: "",
  });
  const [employerContact, setEmployerContact] = useState<{
    email: string;
    phoneNumber: string;
  }>({
    email: "",
    phoneNumber: "",
  });
  const [employerAddress, setemployerAddress] = useState<AddressModel>({
    country: "CABO_VERDE",
    state: "",
    island: "SANTIAGO",
    city: "",
    zone: "",
    street: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const closeEditingSection = (alertMessage: string) => {
    setEditingSection(null);
    alert(alertMessage);
  };
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>("");
  const [editingSection, setEditingSection] = useState<string | null>(null); // which section is open
  const [formData, setFormData] = useState<EmployerAccountForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "CABO_VERDE",
    state: "",
    island: "SANTIAGO",
    city: "",
    zone: "",
    postalCode: "",
    street: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (!authLoading && !isEntityLoggedIn) navigate("/employer-login");
  }, [authLoading, isEntityLoggedIn]);

  // ── Fetch profile on mount (@PostConstruct equivalent) ────────────────────
  useEffect(() => {
    getEmployerProfileData()
      .then((data) => {
        setEmployer(data);
        // Populate form with existing values — like calling BeanUtils.copyProperties()
        setFormData({
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          email: data?.email || "",
          phoneNumber: data?.phoneNumber || "",
          country: data?.address?.country || "",
          island: data?.address?.island || "",
          state: data?.address?.state || "",
          city: data?.address?.city || "",
          zone: data?.address?.zone || "",
          postalCode: data?.address?.postalCode || "",
          street: data?.address?.street || "",
          username: data?.username || "",
          password: "",
        });
      })
      .catch((err) => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
    setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };

  const startEditing = (section: string) => setEditingSection(section);
  const cancelEditing = () => setEditingSection(null);
  const isEditing = (section: string) => editingSection === section;

  const saveSection = async (section: string) => {
    if (!employer?.username) return;
    let dataToUpdate: any = {};
    try {
      if (section === "personal") {
        dataToUpdate = {
          firstName: formData.firstName,
          lastName: formData.lastName,
        };
        if (!isNameValid(formData.firstName, formData.lastName)) {
          alert(
            "O nome ou apelido é inválido.\n\n" +
              "Regras permitidas:\n" +
              "• Apenas letras (A-Z, com ou sem acentos portugueses como á, ç, õ, ê)\n" +
              "• São permitidos hífens (-) e espaços simples entre nomes\n" +
              "• Não pode começar ou terminar com espaços ou hífens\n" +
              "• Máximo de 20 caracteres por campo",
          );
          return;
        }
        const response = await updateName("EMPLOYER", dataToUpdate);
        if (response.status === 200) {
          setEmployerName({
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
          setEmployer((prev) => (prev ? { ...prev, ...dataToUpdate } : null));

          closeEditingSection("Nome atualizado com sucesso!");
        } else if (response.status >= 400 && response.status < 500) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar as informações do perfil.");
        }
      } else if (section === "contact") {
        dataToUpdate = {
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        };
        if (!isEmailValid(formData.email)) {
          alert(
            "Por favor, insira um e-mail válido (exemplo: seu-email@dominio.com).",
          );
          return;
        }
        if (!isPhoneNumberValid(formData.phoneNumber)) {
          alert(
            "Por favor, insira um numero de telefone válido (exemplo: +238 111 3333).",
          );
          return;
        }
        const response = await updateContact("EMPLOYER", dataToUpdate);
        if (response.status === 200) {
          setEmployerContact({
            email: formData.email,
            phoneNumber: formData.phoneNumber,
          });
          setEmployer((prev) => (prev ? { ...prev, ...dataToUpdate } : null));
          closeEditingSection("Contacto atualizada com sucesso!");
        } else if (response.status >= 400 && response.status < 500) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar as informações de contacto.");
        }
      } else if (section === "address") {
        dataToUpdate = {
          country: formData.country,
          state: formData.state,
          island: formData.island,
          city: formData.city,
          zone: formData.zone,
          postalCode: formData.postalCode,
          street: formData.street,
        };
        console.log("Country: ", formData.country);
        const response = await updateAddress("EMPLOYER", dataToUpdate);
        if (!isAddressValid(dataToUpdate)) {
          return;
        }
        if (response.status === 200) {
          setemployerAddress({ ...dataToUpdate });
          setEmployer((prev) =>
            prev ? { ...prev, address: { ...dataToUpdate } } : null,
          );

          closeEditingSection("Morada atualizada com sucesso!");
        } else if (response.status >= 400 && response.status < 500) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar as informações de morada.");
        }
      } else if (section === "security") {
        dataToUpdate = {
          username: formData.username,
          password: formData.password,
        };
        if (!isUsernameValid(formData.username)) {
          alert(
            "O novo nome de utilizador deve ter entre 8 e 20 caracteres e não pode conter espaços, aspas ou barras (\\ /).",
          );
          return;
        }
        if (!isPasswordValid(formData.password)) {
          alert(
            "Por favor, insira uma palavra-passe válida, sem espaços e com um mínimo de 8 caracteres.",
          );
          return;
        }
        const response = await updateCredentials("EMPLOYER", dataToUpdate);

        if (response.status === 200) {
          setEmployer((prev) =>
            prev ? { ...prev, username: { ...dataToUpdate.username } } : null,
          );
          dataToUpdate.password = "";
          closeEditingSection("Credenciais atualizadas com sucesso!");
        } else if (response.status >= 400 && response.status < 500) {
          alert(await response.text());
        } else {
          alert(
            "Falha ao atualizar as credenciais. Por favor contacta o administrador do website!",
          );
        }
      }
    } catch (exception) {
      console.error("Error updating profile section:", exception);
      alert("An unexpected error occurred while saving.");
    }
  };
  const handleLogout = async () => {
    await logoutHandler();
    navigate("/");
  };
  if (loading) return <div>A carregar perfil...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!employer) return <div>Nenhum dado de empregador encontrado.</div>;

  return (
    <div>
      <main className="profile-main">
        <div className="page-header">
          <p className="page-eyebrow">Conta</p>
          <h1 className="page-title">O Meu Perfil</h1>
        </div>

        {/* ── Personal Info ──────────────────────────────────────────────── */}
        <div className="profile-section" id="section-personal">
          <div className="section-head">
            <div className="section-head-left">
              <i className="bi bi-person-fill"></i>
              <span className="section-head-title">Nome Completo</span>
            </div>
            <button
              className={`btn-edit ${isEditing("personal") ? "editing" : ""}`}
              id="edit-fullName"
              onClick={() =>
                isEditing("personal")
                  ? cancelEditing()
                  : startEditing("personal")
              }
            >
              <i className="bi bi-pencil"></i>{" "}
              {isEditing("personal") ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="fields-grid">
            <div
              className={`field-group ${isEditing("personal") ? "is-editing" : ""}`}
            >
              <span className="field-label">Primeiro Nome</span>
              <span className="field-value">
                {formData.firstName || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("personal") ? "is-editing" : ""}`}
            >
              <span className="field-label">Último Name</span>
              <span className="field-value">
                {formData.lastName || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {isEditing("personal") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={() => saveSection("personal")}
              >
                <i className="bi bi-check2"></i> Salvar Alterações
              </button>
            </div>
          )}
        </div>

        {/* ── Contact ────────────────────────────────────────────────────── */}
        <div className="profile-section" id="section-contact">
          <div className="section-head">
            <div className="section-head-left">
              <i className="bi bi-envelope-fill"></i>
              <span className="section-head-title">Detalhes de Contacto</span>
            </div>
            <button
              id="edit-contact"
              className={`btn-edit ${isEditing("contact") ? "editing" : ""}`}
              onClick={() =>
                isEditing("contact") ? cancelEditing() : startEditing("contact")
              }
            >
              <i className="bi bi-pencil"></i>{" "}
              {isEditing("contact") ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="fields-grid">
            <div
              className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}
            >
              <span className="field-label">Endereço de Email</span>
              <span className="field-value">
                {formData.email || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}
            >
              <span className="field-label">Número de telefone</span>
              <span className="field-value" id="phoneNumberLabel">
                {formData.phoneNumber || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {isEditing("contact") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>
                Cancelar
              </button>
              <button
                className="btn-save"
                onClick={() => saveSection("contact")}
              >
                <i className="bi bi-check2"></i> Salvar Alterações
              </button>
            </div>
          )}
        </div>

        {/* ── Address ────────────────────────────────────────────────────── */}
        <div className="profile-section" id="section-address">
          <div className="section-head">
            <div className="section-head-left">
              <i className="bi bi-geo-alt-fill"></i>
              <span className="section-head-title">Detalhes da Morada</span>
            </div>
            <button
              id="edit-address"
              className={`btn-edit ${isEditing("address") ? "editing" : ""}`}
              onClick={() =>
                isEditing("address") ? cancelEditing() : startEditing("address")
              }
            >
              <i className="bi bi-pencil"></i>{" "}
              {isEditing("address") ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="fields-grid triple">
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">País</span>
              <span className="field-value">
                {formData.country.replaceAll("_", " ") || "Não definido"}
              </span>
              <select
                className="field-input"
                id="inp-country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Selecionar Pais
                </option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Estado</span>
              <span className="field-value">
                {formData.state || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-state"
                type="text"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Ilha</span>
              <span className="field-value">
                {formData.island || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-island"
                type="text"
                value={formData.island}
                onChange={handleInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Cidade</span>
              <span className="field-value">
                {formData.city || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-city"
                type="text"
                required
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Zona/Bairo</span>
              <span className="field-value">
                {formData.zone || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-zone"
                type="text"
                value={formData.zone}
                onChange={handleInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Código Postal (opcional)</span>
              <span className="field-value">
                {formData.postalCode || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Rua (opcional)</span>
              <span className="field-value">
                {formData.street || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-street"
                type="text"
                value={formData.street}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {isEditing("address") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={() => saveSection("address")}
              >
                <i className="bi bi-check2"></i> Salvar Alterações
              </button>
            </div>
          )}
        </div>

        {/* ── Security ───────────────────────────────────────────────────── */}
        <div className="profile-section" id="section-security">
          <div className="section-head">
            <div className="section-head-left">
              <i className="bi bi-shield-lock-fill"></i>
              <span className="section-head-title">Detalhes de Segurança</span>
            </div>
            <button
              id="edit-credentials"
              className={`btn-edit ${isEditing("security") ? "editing" : ""}`}
              onClick={() =>
                isEditing("security")
                  ? cancelEditing()
                  : startEditing("security")
              }
            >
              <i className="bi bi-pencil"></i>{" "}
              {isEditing("security") ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="fields-grid">
            <div
              className={`field-group ${isEditing("security") ? "is-editing" : ""}`}
            >
              <span className="field-label">Username</span>
              <span className="field-value">
                {formData.username || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("security") ? "is-editing" : ""}`}
            >
              <span className="field-label">Password</span>
              <span className="field-value">
                <span className="pwd-dots">●●●●●●●●●●●●</span>
              </span>
              <input
                className="field-input"
                id="inp-password"
                type="password"
                placeholder="New password"
                onChange={handleInputChange}
              />
            </div>
          </div>

          {isEditing("security") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={() => saveSection("security")}
              >
                <i className="bi bi-check2"></i> Update Credentials
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EmployerProfileView;
