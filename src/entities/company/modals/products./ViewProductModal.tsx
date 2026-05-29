
import { useEffect, useState } from "react";
import { StaffModel } from "../../../../api/interfaces";
import {  ALL_PERMISSIONS } from "../../../../api/categories";

interface Properties {
  isOpen:   boolean;
    staff:     StaffModel;
  onClose:  () => void;
}   

function ViewStaffModal({isOpen, onClose, staff}:Properties){
    const [staffForm, setStaffForm] = useState<StaffModel>({
        id: "",
        username : "",
        firstName:  "",
        lastName:  "",
        email : "",
        phoneNumber :  "",
        hiredAt :  "",
        salary :  0,
        jobTitle:  "",
        companyId :  "",
        assignedPermissions: [],
        address:{
            island: "",
            city:"",
            zone:"",
            street: "",
            postalCode:""
        }
        });
     
        useEffect(()=>{
            if(staff){
                setStaffForm(staff)
            }
        },[staff]);
            
    if(!isOpen || !staff ) return null;
    
     return (
            <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">View @{staff?.username}</span>
          <button className="m-close" onClick={()=> onClose()}>&times;</button>
        </div>
    
          <div className="m-body">
            
            {/* Account Credentials */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Username *</label>
                <input className="m-input" type="text" value={staff.username}  name="username" readOnly  />
              </div>
              
            </div>
    
            {/* Personal Info */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">First Name *</label>
                <input className="m-input" type="text" value={staff.firstName} name="firstName"    readOnly/>
              </div>
              <div className="m-field">
                <label className="m-label">Last Name *</label>
                <input className="m-input" type="text" value={staff.lastName}  name="lastName"  readOnly />
              </div>
            </div>
    
            {/* Contact Info */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Email *</label>
                <input className="m-input" type="email" name="email"  value={staff.email}   readOnly/>
              </div>
              <div className="m-field">
                <label className="m-label">Phone Number</label>
                <input className="m-input" type="tel" name="phoneNumber" value={staffForm.phoneNumber}   readOnly />
              </div>
            </div>
    
            {/* Employment Info */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Job Title *</label>
                <input className="m-input" type="text"  value={staffForm.jobTitle} readOnly />
              </div>
    
            </div>
    
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Hired At</label>
                <input className="m-input" type="date" name="hiredAt" value={staff.hiredAt}  readOnly />
              </div>
              <div className="m-field">
                <label className="m-label">Salary</label>
                <input className="m-input" type="number"  name="salary" value={staff.salary}  readOnly />
              </div>
            </div>
    
            {/* Address */}
            <div className="m-field">
              <label className="m-label"><i className="bi bi-geo-alt-fill me-1"></i> Address</label>
            </div>
            
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Island</label>
                <input className="m-input" type="text"  name="island" value={staff?.address?.island ?? ""}  readOnly />
              </div>
              <div className="m-field">
                <label className="m-label">City</label>
                <input className="m-input" type="text"    value={staff?.address?.city ?? ""}  readOnly />
              </div>
            </div>
            
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Zone</label>
                <input className="m-input" type="text"  name="zone" value={staff?.address?.zone ?? ""}  readOnly  />
              </div>
              <div className="m-field">
                <label className="m-label">Postal Code</label>
                <input className="m-input" type="text" name="postalCode" value={staff?.address?.postalCode ?? ""}   readOnly />
              </div>
            </div>
            
            <div className="m-field">
              <label className="m-label">Street</label>
              <input className="m-input" type="text"  name="street"   value={staff?.address?.street ?? ""} readOnly  />
            </div>
             {/* Permissions */}
                <div className="form-section">Permissions *</div>
                <div className="perm-grid">
                  {ALL_PERMISSIONS.map((perm) => (
                    <div className="perm-item" key={perm.value}>
                      <input
                        name="assignedPermissions"
                        type="checkbox"
                        className="perm-checkbox"
                        id={`perm-${perm.value}`}
                        value={perm.value}
                        checked={staffForm.assignedPermissions.includes(perm.value)}
                       
                      />
                      <label htmlFor={`perm-${perm.value}`}>
                        {perm.label}
                        <small>{perm.description}</small>
                      </label>
                    </div>
                  ))}
                </div>

          </div>
      </div>
    </div>
        )
}
export default ViewStaffModal;