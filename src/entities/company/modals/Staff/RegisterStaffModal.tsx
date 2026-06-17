import { useState } from "react";
import { CompanyModel, RegisterStaffModel } from "../../../../api/interfaces";
import { addressFields, ALL_PERMISSIONS } from "../../../../api/categories";
import { Permissions } from "../../../../api/interfaces";
import { registerStaff } from "../../../../api/requests";
import { hanldeResponseStatus } from "../../views/StaffView";
interface Parameters{
    isOpen: boolean;
    onClose: ()  => void;
    onSuccess: () => void;
    company: CompanyModel
}

function RegisterStaffModal({isOpen, onClose, onSuccess, company}:Parameters){
    const [error, setError] = useState<string | null>(null);
    const [loading,setLoadiong] = useState<boolean>(false);
    const [staff, setStaff] = useState<RegisterStaffModel>({
            username : "",
            firstName:  "",
            lastName:  "",
            email : "",
            phoneNumber :  "",
            hiredAt :  "",
            salary :  0,
            jobTitle:  "",
            department:"",
            companyId :  company.id!,
            assignedPermissions: [],
            address:{
                island: "",
                city:"",
                zone:"",
                street: "",
                postalCode:""
            },
            password:""
    });

    const handleInputChange  = (event: React.ChangeEvent<HTMLInputElement, HTMLSelectElement>) => {
        const {name, value} = event.target;
        if(addressFields.includes(name)){
            setStaff( (prev ) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value
                }
                }));
        }else{
            setStaff( (prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleRegisterStaff = async (event: React.SyntheticEvent<HTMLFormElement>)=>{
        event.preventDefault();
        setError(null);
        setLoadiong(true);
        const response = await registerStaff(staff);
        console.log("Response Registering Staff: ", response)
        if(response.status === 201){
            alert("Staff Successfylly Registered")
            onSuccess();
            onClose();
        }else{
          hanldeResponseStatus(response.status);
        }
       
        setLoadiong(false)
    
    }

    const handlePermissionToggle = (permission: Permissions) => {
    console.log(permission)
    if(!permission) return;
        // Explicitly typing 'prev' here as a backup if the hook inference fails
        setStaff((prev: RegisterStaffModel) => {
        const isExisting = prev.assignedPermissions.includes(permission);
        return {
            ...prev,
            assignedPermissions: isExisting
            ? prev.assignedPermissions.filter((p: Permissions) => p !== permission)
            : [...prev.assignedPermissions, permission],
        };
        });
    };
    if(!isOpen) return null;
   
    return (
  <div className="m-overlay open">
    <div className="m-box">
      <div className="m-head">
        <span className="m-head-title">Registar Novo Funcionário</span>
        <button className="m-close" onClick={() => onClose()}>&times;</button>
      </div>
      <form id="staffRegistrationForm" onSubmit={handleRegisterStaff}>      
        <div className="m-body">
          
          {/* Credenciais da Conta */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Nome de Utilizador (Mínimo de 8 caracteres)</label>
              <input className="m-input" type="text" placeholder="ex: jsmith" name="username" min={8} max={50}  onChange={handleInputChange} required/>
            </div>
            <div className="m-field">
              <label className="m-label">Palavra-passe (Mínimo de 8 caracteres) </label>
              <input className="m-input" type="password" placeholder="••••••••" min={8} max={50} name="password" onChange={handleInputChange} required />
            </div>
          </div>

          {/* Informação Pessoal */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Primeiro Nome *</label>
              <input className="m-input" type="text" placeholder="ex: João" name="firstName" onChange={handleInputChange} required/>
            </div>
            <div className="m-field">
              <label className="m-label">Último Nome *</label>
              <input className="m-input" type="text" placeholder="ex: Silva" name="lastName" onChange={handleInputChange} required/>
            </div>
          </div>

          {/* Contacto */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Email *</label>
              <input className="m-input" type="email" placeholder="jsilva@exemplo.com" name="email" onChange={handleInputChange} required />
            </div>
            <div className="m-field">
              <label className="m-label">Número de Telefone</label>
              <input className="m-input" type="tel" placeholder=" 123 4567" name="phoneNumber" onChange={handleInputChange} required />
            </div>
          </div>

          {/* Informação Laboral */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Cargo *</label>
              <input className="m-input" type="text" placeholder="ex: Caixa" name="jobTitle" onChange={handleInputChange} />
            </div>
            <div className="m-field">
              <label className="m-label">Departamento *</label>
              <input className="m-input" type="text" placeholder="ex: Peixaria" name="department" onChange={handleInputChange} />
            </div>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Data de Contratação</label>
              <input className="m-input" type="date" name="hiredAt" onChange={handleInputChange} required/>
            </div>
            <div className="m-field">
              <label className="m-label">Salário Mensal</label>
              <input className="m-input" type="number" placeholder="ex: 35000" name="salary" onChange={handleInputChange} required/>
            </div>
          </div>

          {/* Morada */}
          <div className="m-field">
            <label className="m-label"><i className="bi bi-geo-alt-fill me-1"></i> Morada</label>
          </div>
          
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Ilha</label>
              <input className="m-input" type="text" placeholder="ex: Santiago" name="island" onChange={handleInputChange} required/>
            </div>
            <div className="m-field">
              <label className="m-label">Cidade</label>
              <input className="m-input" type="text" placeholder="ex: Praia" name="city" onChange={handleInputChange} required/>
            </div>
          </div>
          
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Zona</label>
              <input className="m-input" type="text" placeholder="ex: Plateau" name="zone" onChange={handleInputChange} required/>
            </div>
            <div className="m-field">
              <label className="m-label">Código Postal</label>
              <input className="m-input" type="text" placeholder="ex: 7600" name="postalCode" onChange={handleInputChange}/>
            </div>
          </div>
          
          <div className="m-field">
            <label className="m-label">Rua</label>
            <input className="m-input" type="text" placeholder="ex: Rua do Município" name="street" onChange={handleInputChange} />
          </div>
          
          {/* Permissões */}
          <div className="form-section">Permissões *</div>
          <small style={{color:"red"}}>É necessário selecionar pelo menos 1 permissão</small>
          <div className="perm-grid">
            {ALL_PERMISSIONS.map((perm) => (
              <div className="perm-item" key={perm.value}>
                <input
                  name="assignedPermissions"
                  type="checkbox"
                  className="perm-checkbox"
                  id={`perm-${perm.value}`}
                  checked={staff.assignedPermissions.includes(perm.value)}
                  onChange={() => handlePermissionToggle(perm.value)}
                />
                <label htmlFor={`perm-${perm.value}`}>
                  {perm.label}
                  <small>{perm.description}</small>
                </label>
              </div>
            ))}
          </div>

          <div className="m-footer">
            <button className="m-btn-cancel" type="button" onClick={() => onClose()}>Cancelar</button>
            <button className="m-btn-save" type="submit">
              <i className="bi bi-check2"></i> Guardar Funcionário
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)
}
export default RegisterStaffModal;