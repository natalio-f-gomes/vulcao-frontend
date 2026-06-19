import React, { useEffect, useState } from "react";
import { CompanyModel, RegisterStaffModel, StaffModel } from "../../../api/interfaces";
import { updateStaff, getStaffByCompanyId, registerStaff } from "../../../api/requests";
import RegisterStaffModal from "../modals/Staff/RegisterStaffModal";
import EditStaffModal from "../modals/Staff/EditStaffModal";
import ViewStaffModal from "../modals/Staff/ViewStaffModal";

interface StaffViewParameters{
    company: CompanyModel
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
            alert("Funcionário(a) atualizado com sucesso.");
            return;
        }else {
            // Try to get error message from response
            let errorMessage = "Ocorreu um erro inesperado. Por favor, tente novamente.";
            
            try {
                // Try to parse as JSON first
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    errorMessage = data.message || data.error || JSON.stringify(data);
                } else {
                    // If not JSON, get as text
                    errorMessage = await response.text();
                }
            } catch (parseError) {
                console.error("Error parsing response:", parseError);
                // Fallback to status text
                errorMessage = response.statusText || `Erro ${response.status}`;
            }
            
            alert(errorMessage);
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
            <div className="view-heading">Funcionários</div>
            <div className="view-sub">Gerir e monitorizar todos os seus funcionários.</div>

            <div className="quick-actions">
                <button className="qa-btn primary" onClick={() => setShowStaffRegisterModal(true)}>
                    <i className="bi bi-plus-lg"></i> Registar Novo Funcionário
                </button>
            </div>
           
            <div className="biz-grid">
                {/* Exemplo de Cartão de Funcionário */}
                {staff.map((member) => (
                    <div className="biz-card" key={member.id}>
                        <div className="biz-banner">
                            <span className="biz-status-badge active">
                                ATIVO
                            </span>
                        </div>
                        
                        <div className="biz-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                            
                            {/* Foto de Perfil no Topo */}
                            {/* <div className="staff-pic-container" style={{ marginTop: "1px", marginBottom: "15px", position: "relative" }}>
                                <img 
                                    src="https://placeholder.com" 
                                    alt="Perfil do Funcionário" 
                                    style={{ width: "80px", height: "80px", borderRadius: "50%", border: "4px solid white", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", objectFit: "cover" }}
                                />
                            </div> */}

                            {/* Nome e Nome de Utilizador */}
                            <div className="biz-name" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{member.firstName} {member.lastName}</div>
                            <div className="biz-cat" style={{ color: "#6c757d", fontSize: "0.85rem", marginBottom: "10px" }}>@{member.username}</div>
                            
                            {/* Cargo */}
                            <div className="staff-role" style={{ fontWeight: "600", color: "#0d6efd", marginBottom: "15px" }}>{member.jobTitle}</div>

                            {/* Detalhes de Contacto */}
                            <div className="staff-contact-details" style={{ width: "100%", textAlign: "left", fontSize: "0.85rem", color: "#495057", marginBottom: "15px", padding: "0 10px" }}>
                                <div style={{ marginBottom: "4px" }}><i className="bi bi-envelope" style={{ marginRight: "8px" }}></i>{member.email}</div>
                                <div style={{ marginBottom: "4px" }}><i className="bi bi-telephone" style={{ marginRight: "8px" }}></i>{member.phoneNumber ?? "Não definido"}</div>
                                <div style={{ marginBottom: "4px" }}><i className="bi bi-geo-alt" style={{ marginRight: "8px" }}></i>{member?.address?.island ?? "Ilha"} - {member?.address?.city ?? "Cidade"} - {member?.address?.zone ?? "Zona"} - {member?.address?.street ?? "Rua"} - {member?.address?.postalCode ?? "Código"}</div>
                                <div><i className="bi bi-building" style={{ marginRight: "8px" }}></i>{member.department}</div>
                                <div><i className="bi bi-building" style={{ marginRight: "8px" }}></i>{member.companyId}</div>
                            </div>

                            {/* Estatísticas do Funcionário (Salário, Data de Contratação, Número de Permissões) */}
                            <div className="biz-stats" style={{ width: "100%" }}>
                                <div>
                                    <div className="biz-stat-val">{member.salary ?? "$00.00"}</div>
                                    <div className="biz-stat-label">Salário</div>
                                </div>
                                <div>
                                    <div className="biz-stat-val">{member.hiredAt ?? "AAAA-MM-DD"}</div>
                                    <div className="biz-stat-label">Contratado a</div>
                                </div>
                                <div>
                                    <div className="biz-stat-val">{(member.assignedPermissions || []).length ?? "Sem Permissões"}</div>
                                    <div className="biz-stat-label">Permissões</div>
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="biz-actions" style={{ width: "100%", marginTop: "15px" }}>
                                <button className="biz-btn view" onClick={() => setStaffToView(member)}>
                                    <i className="bi bi-eye"></i> Ver
                                </button>
                                <button className="biz-btn edit" onClick={() => setStaffToEdit(member as RegisterStaffModel)}>
                                    <i className="bi bi-pencil"></i> Editar
                                </button>
                                {/* <button className="biz-btn del">
                                    <i className="bi bi-trash"></i>
                                </button> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {/* Cartão Adicionar Novo Funcionário */}
        <div className="biz-card-new" onClick={() => setShowStaffRegisterModal(true)}>
            <i className="bi bi-plus-circle"></i>
            <span> Registar Funcionário</span>
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