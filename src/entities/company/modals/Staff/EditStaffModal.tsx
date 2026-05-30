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
                setStaffForm(staff)
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
          <span className="m-head-title">Edit @{staff?.username}</span>
          <button className="m-close" onClick={()=> onClose()}>&times;</button>
        </div>
    
          <div className="m-body">
            
            {/* Account Credentials */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Username *</label>
                <input className="m-input" type="text" value={staffForm.username} placeholder="e.g. jsmith" name="username"  onChange={handleInputChange} required/>
              </div>
              <div className="m-field">
               
                <label className="m-label">Password</label>
                <input className="m-input" type="password" placeholder="••••••••" name="password" onChange={handleInputChange}  />
                 <small>Leave Blank to keep the same password</small>
              </div>
            </div>
    
            {/* Personal Info */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">First Name *</label>
                <input className="m-input" type="text" value={staffForm.firstName} placeholder="e.g. John" name="firstName"  onChange={handleInputChange}  required/>
              </div>
              <div className="m-field">
                <label className="m-label">Last Name *</label>
                <input className="m-input" type="text" value={staffForm.lastName} placeholder="e.g. Smith" name="lastName"  onChange={handleInputChange} required />
              </div>
            </div>
    
            {/* Contact Info */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Email *</label>
                <input className="m-input" type="email" placeholder="jsmith@example.com" name="email"  value={staffForm.email}  onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Phone Number</label>
                <input className="m-input" type="tel" placeholder="+1 (555) 000-0000" name="phoneNumber" value={staffForm.phoneNumber}  onChange={handleInputChange}  />
              </div>
            </div>
    
            {/* Employment Info */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Job Title *</label>
                <input className="m-input" type="text" placeholder="e.g. Cashier" name="jobTitle"  value={staffForm.jobTitle}  onChange={handleInputChange} required/>
              </div>
              <div className="m-field">
                <label className="m-label">Department *</label>
                <input className="m-input" type="text" placeholder="Meat Department" name="department"  value={staffForm.department}  onChange={handleInputChange}/>
              </div>
    
            </div>
    
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Hired At</label>
                <input className="m-input" type="date" name="hiredAt" value={staffForm.hiredAt}  onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Salary</label>
                <input className="m-input" type="number" placeholder="e.g. 35000" name="salary" value={staffForm.salary}  onChange={handleInputChange} />
              </div>
            </div>
    
            {/* Address */}
            <div className="m-field">
              <label className="m-label"><i className="bi bi-geo-alt-fill me-1"></i> Address</label>
            </div>
            
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Island</label>
                <input className="m-input" type="text" placeholder="e.g. Santiago" name="island" value={staffForm?.address?.island ?? ""}  onChange={handleInputChange} required/>
              </div>
              <div className="m-field">
                <label className="m-label">City</label>
                <input className="m-input" type="text" placeholder="e.g. Praia" name="city"   value={staffForm?.address?.city ?? ""}  onChange={handleInputChange} required />
              </div>
            </div>
            
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Zone</label>
                <input className="m-input" type="text" placeholder="e.g. Plateau" name="zone" value={staffForm?.address?.zone ?? ""}  onChange={handleInputChange} required />
              </div>
              <div className="m-field">
                <label className="m-label">Postal Code</label>
                <input className="m-input" type="text" placeholder="e.g. 7600" name="postalCode" value={staffForm?.address?.postalCode ?? ""}  onChange={handleInputChange}  />
              </div>
            </div>
            
            <div className="m-field">
              <label className="m-label">Street</label>
              <input className="m-input" type="text" placeholder="e.g. Rua do Município" name="street"   value={staffForm?.address?.street ?? ""}  onChange={handleInputChange} />
            </div>
             {/* Permissions */}
                <div className="form-section">Permissions *</div>
                <small style={{color:"red"}}>At least 1 permission must be selected</small>
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
              <button className="m-btn-cancel" type="button" onClick={()=> onClose()}>Cancel</button>
              <button className="m-btn-save" onClick={handleStaffUpdate}>
                <i className="bi bi-check2"></i> Update Staff
              </button>
            </div>
          </div>
      </div>
    </div>
        )
}
export default EditStaffModal;