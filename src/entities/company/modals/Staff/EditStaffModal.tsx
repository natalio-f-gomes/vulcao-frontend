import { useEffect, useState } from "react";
import { CompanyModel, RegisterStaffModel, StaffModel } from "../../../../api/interfaces";
import { addressFields, ALL_PERMISSIONS } from "../../../../api/categories";
import { Permissions } from "../../../../api/interfaces";
interface Properties {
  isOpen:   boolean;
  company:     CompanyModel;
  staff:     RegisterStaffModel;
  onClose:  () => void;
  onSave:   (updated: RegisterStaffModel) => void;
}   

function EditStaffModal({isOpen, company, onClose, onSave, staff}:Properties){
    const [staffForm, setStaffForm] = useState<RegisterStaffModel>({
        id: "",
        username : "",
        firstName:  "",
        lastName:  "",
        email : "",
        phoneNumber :  "",
        hiredAt :  "",
        salary :  0,
        jobTitle:  "",
        department:"",
        companyId :  company!.id!,
        assignedPermissions: [],
        address:{
            island: "",
            city:"",
            zone:"",
            street: "",
            postalCode:""
        },
        password: ""
        });
     
        useEffect(()=>{
            if(staff){
                setStaffForm({
                  ...staff,
                  password:""
                })
            }
        },[staff]);
        

    const handleInputChange  = (event: React.ChangeEvent<HTMLInputElement, HTMLSelectElement>) => {
        const {name, value} = event.target;

        if(addressFields.includes(name)){
            setStaffForm( (prev ) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value
                }
                }));
        }else{
            setStaffForm( (prev) => ({
                ...prev,
                [name]: value,
            }));
        };
    };


    const handlePermissionToggle = (permission: Permissions) => {
        console.log("Permission selected: ",permission)
        if(!permission) return;
            // Explicitly typing 'prev' here as a backup if the hook inference fails
            setStaffForm((prev: RegisterStaffModel) => {
            const isExisting = prev.assignedPermissions.includes(permission);
            console.log("Existing: ", isExisting)
            return {
                ...prev,
                assignedPermissions: isExisting
                ? prev.assignedPermissions.filter((p: Permissions) => p !== permission)
                : [...prev.assignedPermissions, permission],
            };
            });
        };

const handleStaffUpdate = () => {
    console.log("Staff data to update: ",JSON.stringify(staffForm))
    onSave(staffForm)
};
    
    if(!isOpen || !staff || !company) return null;
    
 return (
  <div className="m-overlay open">
    <div className="m-box">
      <div className="m-head">
        <span className="m-head-title">Editar @{staff?.username}</span>
        <button className="m-close" onClick={() => onClose()}>&times;</button>
      </div>
    
      <div className="m-body">
        
        {/* Credenciais da Conta */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Nome de Utilizador *</label>
            <input className="m-input" type="text" value={staffForm.username} placeholder="ex: jsmith" name="username" onChange={handleInputChange} required/>
          </div>
          <div className="m-field">
            <label className="m-label">Palavra-passe</label>
            <input className="m-input" type="password" placeholder="••••••••" name="password" onChange={handleInputChange} />
            <small>Deixar em branco para manter a mesma palavra-passe</small>
          </div>
        </div>

        {/* Informação Pessoal */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Primeiro Nome *</label>
            <input className="m-input" type="text" value={staffForm.firstName} placeholder="ex: João" name="firstName" onChange={handleInputChange} required/>
          </div>
          <div className="m-field">
            <label className="m-label">Último Nome *</label>
            <input className="m-input" type="text" value={staffForm.lastName} placeholder="ex: Silva" name="lastName" onChange={handleInputChange} required />
          </div>
        </div>

        {/* Contacto */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Email *</label>
            <input className="m-input" type="email" placeholder="jsilva@exemplo.com" name="email" value={staffForm.email} onChange={handleInputChange} />
          </div>
          <div className="m-field">
            <label className="m-label">Número de Telefone</label>
            <input className="m-input" type="tel" placeholder="+1 (555) 000-0000" name="phoneNumber" value={staffForm.phoneNumber} onChange={handleInputChange} />
          </div>
        </div>

        {/* Informação Laboral */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Cargo *</label>
            <input className="m-input" type="text" placeholder="ex: Caixa" name="jobTitle" value={staffForm.jobTitle} onChange={handleInputChange} required/>
          </div>
          <div className="m-field">
            <label className="m-label">Departamento *</label>
            <input className="m-input" type="text" placeholder="Talho" name="department" value={staffForm.department} onChange={handleInputChange}/>
          </div>
        </div>

        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Data de Contratação</label>
            <input className="m-input" type="date" name="hiredAt" value={staffForm.hiredAt} onChange={handleInputChange} />
          </div>
          <div className="m-field">
            <label className="m-label">Salário</label>
            <input className="m-input" type="number" placeholder="ex: 35000" name="salary" value={staffForm.salary} onChange={handleInputChange} />
          </div>
        </div>

        {/* Morada */}
        <div className="m-field">
          <label className="m-label"><i className="bi bi-geo-alt-fill me-1"></i> Morada</label>
        </div>
        
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Ilha</label>
            <input className="m-input" type="text" placeholder="ex: Santiago" name="island" value={staffForm?.address?.island ?? ""} onChange={handleInputChange} required/>
          </div>
          <div className="m-field">
            <label className="m-label">Cidade</label>
            <input className="m-input" type="text" placeholder="ex: Praia" name="city" value={staffForm?.address?.city ?? ""} onChange={handleInputChange} required />
          </div>
        </div>
        
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Zona</label>
            <input className="m-input" type="text" placeholder="ex: Plateau" name="zone" value={staffForm?.address?.zone ?? ""} onChange={handleInputChange} required />
          </div>
          <div className="m-field">
            <label className="m-label">Código Postal</label>
            <input className="m-input" type="text" placeholder="ex: 7600" name="postalCode" value={staffForm?.address?.postalCode ?? ""} onChange={handleInputChange} />
          </div>
        </div>
        
        <div className="m-field">
          <label className="m-label">Rua</label>
          <input className="m-input" type="text" placeholder="ex: Rua do Município" name="street" value={staffForm?.address?.street ?? ""} onChange={handleInputChange} />
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
                value={perm.value}
                checked={staffForm.assignedPermissions.includes(perm.value) || false}
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
          <button className="m-btn-save" onClick={handleStaffUpdate}>
            <i className="bi bi-check2"></i> Atualizar Funcionário
          </button>
        </div>
      </div>
    </div>
  </div>
)
}
export default EditStaffModal;