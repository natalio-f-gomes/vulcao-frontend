// src/pages/Company-Dashboard/components/EmployeeSection.tsx

import { useState } from "react";
import { RegisterStaffModel, StaffModel } from "../../../api/interfaces";

interface Props {
  employees:  RegisterStaffModel[];
  onAdd:      () => void;
  onEdit:     (employee: RegisterStaffModel) => void;
  onDelete:   (employee: RegisterStaffModel) => void;
}

function StaffSection({ employees, onAdd, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState<string>("");
  console.log(employees)
  const filtered = employees.filter((emp) => {
    const term = search.toLowerCase();
    return (
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term)  ||
      emp.email.toLowerCase().includes(term)     ||
      emp.jobTitle.toLowerCase().includes(term)
    );
  });

  

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "—";

  return (
    <div className="emp-section ms-1 mt-2" style={{paddingTop:10}} id="emp-section">

      {/* Toolbar */}
      <div className="emp-toolbar" style={{paddingBottom:10}}>
        <div className="emp-toolbar-left">
          <div className="ms-3">
            <h3> Staff Members&nbsp;
            <span className="emp-count-badge me-5" style={{fontSize:20}}>{employees.length}</span>
            </h3>
          </div>
          <div className="search-wrap">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search by name, role, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary me-2" onClick={onAdd}>
          <i className="bi bi-person-plus"></i> Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="emp-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Job title</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Salary</th>
              <th>Hired</th>
              <th>Phone Number</th>
              <th style={{ width: "80px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="table-state">
                    <i className="bi bi-people"></i>
                    {search ? "No employees match your search." : "No employees yet. Add one to get started."}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-name-cell">
                      <div className="emp-avatar">
                        {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="emp-full-name">{emp.firstName} {emp.lastName}</div>
                        <div className="emp-username">@{emp.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.jobTitle || "—"}</td>
                  <td>{emp.email || "—"}</td>
                  <td>{emp.phoneNumber || "—"}</td>
                  <td>{emp.salary ? `$${emp.salary.toLocaleString()}` : "—"}</td>
                  <td>{formatDate(emp.hiredAt)}</td>
                  <td>{emp.phoneNumber|| "-"}</td>
                  <td>
                    <div className="row-actions">
                      <button className="row-btn edit" onClick={() => onEdit(emp)} title="Edit">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="row-btn del" onClick={() => onDelete(emp)} title="Remove">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffSection;
