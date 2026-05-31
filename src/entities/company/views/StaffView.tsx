import React, { useEffect, useState } from "react";
import { CompanyModel, RegisterStaffModel, StaffModel } from "../../../api/interfaces";
import { updateStaff, getStaffByCompanyId, registerStaff } from "../../../api/requests";
import RegisterStaffModal from "../modals/Staff/RegisterStaffModal";
import EditStaffModal from "../modals/Staff/EditStaffModal";
import ViewStaffModal from "../modals/Staff/ViewStaffModal";

interface StaffViewParameters{
    company: CompanyModel
}

export const hanldeResponseStatus = (status: number)=> {
    switch(status){
        case 201: alert("Successgully Registered"); return;
        case 500: alert("There was a server error"); return;
        case 403: alert("Access Denied"); return;
        case 401: alert("You do not have the permissions to do this action"); return;
        case 409: alert("please choose different email or username"); return;
        case 202: alert("Accepted"); return;
        case 400: alert("Please verify the data and ensure to follow the rules"); return;
    }
}


function CompanyStaffView({company}: StaffViewParameters){
    const [staff, setStaff] = useState<StaffModel[]>([]);
    const [staffToEdit, setStaffToEdit] = useState<RegisterStaffModel| null>(null);
    const [staffToView, setStaffToView] = useState<StaffModel|null>(null);
    const [showStaffRegisterModal, setShowStaffRegisterModal] = useState<boolean>(false);

    const updateStaffRequest = async (staff: RegisterStaffModel) =>{
        const response = await updateStaff(staff.id!, staff);
        console.log(`Staff Update response: ${response}`)
        if(response.status === 200){
            setStaffToEdit(null);
            getStaff();
            alert("Staff Updated successfully");
            return;
        }else{
            hanldeResponseStatus(response.status);
        }
    }

    const getStaff = async () => {
        const response = await getStaffByCompanyId(company.id!);
        console.log(`Response trying to get the staff members: ${response}`);
        if(!response.ok){
            alert("There was an issue with your resquest");
            return;
        }
        const staffList = await response.json();
        setStaff(staffList);
        console.log(`Staff list: ${staffList}`)
    }

    useEffect( () => {
        getStaff();
    },[company.id])


    return (
        <>
            <div>
            <div className="view-heading">Staff Members</div>
            <div className="view-sub">Manage and monitor all your staff.</div>

            <div className="quick-actions">
                <button className="qa-btn primary" onClick={()=> setShowStaffRegisterModal(true)}>
                <i className="bi bi-plus-lg"></i> Register New Staff
                </button>
            </div>
           
            <div className="biz-grid" >
                {/* Example Staff Card */}
                 {staff.map( (member) => (
                <div className="biz-card" key={member.id}>
                <div className="biz-banner">
                    <span className="biz-status-badge active">
                    ACTIVE
                    </span>
                </div>
                
                <div className="biz-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    
                    {/* Profile Picture at the Top */}
                    <div className="staff-pic-container" style={{ marginTop: "1px", marginBottom: "15px", position: "relative" }}>
                    <img 
                        src="https://placeholder.com" 
                        alt="Staff Profile" 
                        style={{ width: "80px", height: "80px", borderRadius: "50%", border: "4px solid white", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", objectFit: "cover" }}
                    />
                    </div>

                    {/* Name and Username */}
                    <div className="biz-name" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{member.firstName} {member.lastName}</div>
                    <div className="biz-cat" style={{ color: "#6c757d", fontSize: "0.85rem", marginBottom: "10px" }}>@{member.username}</div>
                    
                    {/* Job Title */}
                    <div className="staff-role" style={{ fontWeight: "600", color: "#0d6efd", marginBottom: "15px" }}>{member.jobTitle}</div>

                    {/* Contact Info Details */}
                    <div className="staff-contact-details" style={{ width: "100%", textAlign: "left", fontSize: "0.85rem", color: "#495057", marginBottom: "15px", padding: "0 10px" }}>
                    <div style={{ marginBottom: "4px" }}><i className="bi bi-envelope" style={{ marginRight: "8px" }}></i>{member.email}</div>
                    <div style={{ marginBottom: "4px" }}><i className="bi bi-telephone" style={{ marginRight: "8px" }}></i>{member.phoneNumber ?? "Not Set"}</div>
                    <div style={{ marginBottom: "4px" }}><i className="bi bi-geo-alt" style={{ marginRight: "8px" }}></i>{member?.address?.island ?? "Island"} - {member?.address?.city ?? "City"} - {member?.address?.zone ?? "Zone"} - {member?.address?.street ?? "Street"} - {member?.address?.postalCode ?? "Code"}</div>
                    <div><i className="bi bi-building" style={{ marginRight: "8px" }}></i>{member.department}</div>
                    <div><i className="bi bi-building" style={{ marginRight: "8px" }}></i>{member.companyId}</div>
                    </div>

                    {/* Staff Stats (Salary, Hire Date, Permissions count) */}
                    <div className="biz-stats" style={{ width: "100%" }}>
                    <div>
                        <div className="biz-stat-val">{member.salary?? "$00.00"}</div>
                        <div className="biz-stat-label">Salary</div>
                    </div>
                    <div>
                        <div className="biz-stat-val">{member.hiredAt ?? "YYYY-MM-DD"}</div>
                        <div className="biz-stat-label">Hired At</div>
                    </div>
                    <div>
                        <div className="biz-stat-val">{(member.assignedPermissions || []).length ?? "No Permissions"}</div>
                        <div className="biz-stat-label">Permissions</div>
                    </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="biz-actions" style={{ width: "100%", marginTop: "15px" }}>
                    <button className="biz-btn view" onClick={()=> setStaffToView(member)} >
                        <i className="bi bi-eye"></i> View
                    </button>
                    <button className="biz-btn edit" onClick={()=> setStaffToEdit(member as RegisterStaffModel)}>
                        <i className="bi bi-pencil"></i> Edit
                    </button>
                    <button className="biz-btn del">
                        <i className="bi bi-trash"></i>
                    </button>
                    </div>
                </div>
                </div>

               ))}
            </div>
           
        </div>
    {/* Add New Staff Card */}
        <div className="biz-card-new" onClick={()=> setShowStaffRegisterModal(true)}>
        <i className="bi bi-plus-circle"></i>
        <span> Register a Staff</span>
        </div>
        <RegisterStaffModal
            isOpen={showStaffRegisterModal}
            onClose={()=> setShowStaffRegisterModal(false)}
            onSuccess={getStaff}
            company={company}
         />
         {staffToEdit &&(
         <EditStaffModal
            onClose={()=>setStaffToEdit(null)}
            isOpen={staffToEdit !== null}
            company={company}
            staff={staffToEdit!}
            onSave={updateStaffRequest}
         />
         )}

         {staffToView && (
            <ViewStaffModal
            onClose={() => setStaffToView(null)}
            isOpen={staffToView !== null}
            staff={staffToView}
            />
         )}
        </>
        
    );
}


export default CompanyStaffView;