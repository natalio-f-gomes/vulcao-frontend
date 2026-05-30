import { useState } from "react";
import { CompanyModel, RegisterStaffModel } from "../../../../api/interfaces";
import { addressFields, ALL_PERMISSIONS } from "../../../../api/categories";
import { Permissions } from "../../../../api/interfaces";
import { registerStaff } from "../../../../api/requests";
import { companyName } from "../../../../api/global";
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
        }
        hanldeResponseStatus(response.status);
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
      <span className="m-head-title">Register New Staff</span>
      <button className="m-close" onClick={()=> onClose()}>&times;</button>
    </div>
    <form id="staffRegistrationForm" onSubmit={handleRegisterStaff}>    
      <div className="m-body">
        
        {/* Account Credentials */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Username *</label>
            <input className="m-input" type="text" placeholder="e.g. jsmith" name="username" onChange={handleInputChange} />
          </div>
          <div className="m-field">
            <label className="m-label">Password *</label>
            <input className="m-input" type="password" placeholder="••••••••" name="password"  onChange={handleInputChange} />
          </div>
        </div>

        {/* Personal Info */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">First Name *</label>
            <input className="m-input" type="text" placeholder="e.g. John" name="firstName"  onChange={handleInputChange} />
          </div>
          <div className="m-field">
            <label className="m-label">Last Name *</label>
            <input className="m-input" type="text" placeholder="e.g. Smith" name="lastName"  onChange={handleInputChange} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Email *</label>
            <input className="m-input" type="email" placeholder="jsmith@example.com" name="email"   onChange={handleInputChange}/>
          </div>
          <div className="m-field">
            <label className="m-label">Phone Number</label>
            <input className="m-input" type="tel" placeholder="+1 (555) 000-0000" name="phoneNumber"  onChange={handleInputChange} />
          </div>
        </div>

        {/* Employment Info */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Job Title *</label>
            <input className="m-input" type="text" placeholder="e.g. Cashier" name="jobTitle"  onChange={handleInputChange} />
          </div>
           <div className="m-field">
            <label className="m-label">Department *</label>
            <input className="m-input" type="text" placeholder="Seafood" name="department"  onChange={handleInputChange} />
          </div>

        </div>

        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Hired At</label>
            <input className="m-input" type="date" name="hiredAt"  onChange={handleInputChange}/>
          </div>
          <div className="m-field">
            <label className="m-label">Salary</label>
            <input className="m-input" type="number" placeholder="e.g. 35000" name="salary" onChange={handleInputChange}/>
          </div>
        </div>

        {/* Address */}
        <div className="m-field">
          <label className="m-label"><i className="bi bi-geo-alt-fill me-1"></i> Address</label>
        </div>
        
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Island</label>
            <input className="m-input" type="text" placeholder="e.g. Santiago" name="island"  onChange={handleInputChange}/>
          </div>
          <div className="m-field">
            <label className="m-label">City</label>
            <input className="m-input" type="text" placeholder="e.g. Praia" name="city"  onChange={handleInputChange}/>
          </div>
        </div>
        
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Zone</label>
            <input className="m-input" type="text" placeholder="e.g. Plateau" name="zone" onChange={handleInputChange} />
          </div>
          <div className="m-field">
            <label className="m-label">Postal Code</label>
            <input className="m-input" type="text" placeholder="e.g. 7600" name="postalCode"  onChange={handleInputChange}/>
          </div>
        </div>
        
        <div className="m-field">
          <label className="m-label">Street</label>
          <input className="m-input" type="text" placeholder="e.g. Rua do Município" name="street" onChange={handleInputChange} />
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
          <button className="m-btn-cancel" type="button" onClick={()=> onClose()}>Cancel</button>
          <button className="m-btn-save" type="submit">
            <i className="bi bi-check2"></i> Save Staff
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
    )
}
export default RegisterStaffModal;