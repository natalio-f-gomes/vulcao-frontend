import { useState, useEffect, MouseEventHandler } from "react";
import {
  StaffModel,
  CompanyModel,
  Permissions,
  RegisterStaffModel,
} from "../../../api/interfaces";
import { registerStaff } from "../../../api/requests";
import { ALL_PERMISSIONS } from "../../../api/categories";
interface Parameters {
  isOpen: boolean;
  employee: RegisterStaffModel | null; // null = add mode, populated = edit mode
  onClose: () => void;
  onSave: (employee: RegisterStaffModel) => void;
  company: CompanyModel;
}

function StaffModal({
  isOpen,
  employee,
  onClose,
  onSave,
  company,
}: Parameters) {
  const isEditMode = employee !== null;

  const [staffRegistrationForm, setStaffRegistrationForm] =
    useState<RegisterStaffModel>({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      hiredAt: "",
      salary: 0,
      jobTitle: "",
      department: "",
      companyId: company.id!,
      assignedPermissions: [],
      address: {
        island: "",
        city: "",
        zone: "",
        street: "",
        postalCode: "",
      },
      password: "",
    });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const addressFields = ["island", "city", "zone", "street", "postalCode"];

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    if (addressFields.includes(name)) {
      setStaffRegistrationForm((prev: RegisterStaffModel) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else if (name === "assignedPermissions") {
      console.log(`Assign permissions field ${value}`);
      const selectTarget = event.target as HTMLSelectElement;
      const selectedValues = Array.from(selectTarget.options)
        .filter((option) => option.selected)
        .map((option) => option.value as Permissions);

      setStaffRegistrationForm((prev: RegisterStaffModel) => ({
        ...prev,
        assignedPermissions: selectedValues,
      }));
    } else {
      setStaffRegistrationForm((prev: RegisterStaffModel) => ({
        ...prev,
        [name]: name === "salary" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handlePermissionToggle = (permission: Permissions) => {
    console.log(permission);
    if (!permission) return;
    // Explicitly typing 'prev' here as a backup if the hook inference fails
    setStaffRegistrationForm((prev: RegisterStaffModel) => {
      const isExisting = prev.assignedPermissions.includes(permission);
      return {
        ...prev,
        assignedPermissions: isExisting
          ? prev.assignedPermissions.filter(
              (p: Permissions) => p !== permission,
            )
          : [...prev.assignedPermissions, permission],
      };
    });
  };

  const handleApiCall = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    console.log(staffRegistrationForm);
    try {
      onSave(staffRegistrationForm);
      onClose();
    } catch (error) {
      setError(`Registration failed ${error}`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Sync the form state with the 'employee' prop whenever it changes
  useEffect(() => {
    if (employee) {
      // EDIT MODE: Populate fields with existing employee data
      setStaffRegistrationForm({
        ...employee,
        // Ensure nested address and permissions have fallbacks to prevent crashes
        address: employee.address || {
          island: "",
          city: "",
          zone: "",
          street: "",
          postalCode: "",
        },
        assignedPermissions: employee.assignedPermissions || [],
        // Password usually shouldn't be populated for security
        password: "",
      });
    } else {
      // ADD MODE: Reset to empty form
      setStaffRegistrationForm({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        hiredAt: "",
        salary: 0,
        jobTitle: "",
        companyId: company.id!,
        department: "",
        assignedPermissions: [],
        address: {
          island: "",
          city: "",
          zone: "",
          street: "",
          postalCode: "",
        },
        password: "",
      });
    }
  }, [employee, company.id, isOpen]); // Re-run whenever the employee or modal status changes
  if (!isOpen) return null; // like @ConditionalOnProperty — only renders when needed

  return (
    <form action="" onSubmit={handleApiCall}>
      <div className="modal-overlay open">
        <div
          className="modal-box"
          style={{
            padding: "40px",
            minWidth: "250px",
            borderColor: "red",
            borderStyle: "solid",
          }}
        >
          <div className="modal-header">
            <span className="modal-title">
              {isEditMode
                ? `Edit ${employee?.firstName} ${employee?.lastName}`
                : "Add new employee"}
            </span>
            <button className="modal-close" onClick={onClose}>
              <i className="bi bi-x"></i>
            </button>
          </div>

          <div className="modal-body">
            {/* Personal Information */}
            <div className="form-section">Personal information</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  First name <span className="req">*</span>
                </label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="firstName"
                  placeholder="Natalio"
                  value={staffRegistrationForm.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Last name <span className="req">*</span>
                </label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="lastName"
                  placeholder="Gomes"
                  value={staffRegistrationForm.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Username <span className="req">*</span>
                </label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="username"
                  placeholder="natalio.gomes"
                  value={staffRegistrationForm.username}
                  onChange={handleInputChange}
                  min={7}
                  max={50}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Email <span className="req">*</span>
                </label>
                <input
                  className="form-control-custom"
                  type="email"
                  name="email"
                  placeholder="employee@company.com"
                  value={staffRegistrationForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password {!isEditMode && <span className="req">*</span>}
              </label>
              <input
                className="form-control-custom"
                type="password"
                name="password"
                placeholder="••••••••"
                value={staffRegistrationForm.password ?? ""}
                onChange={handleInputChange}
                /* Only required if we are NOT in edit mode */
                required={!isEditMode}
              />
              {isEditMode && (
                <div className="password-hint">
                  Leave blank to keep the current password.
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-control-custom"
                type="text"
                name="phoneNumber"
                placeholder="123 4567"
                value={staffRegistrationForm.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            {/* Job Details */}
            <div className="form-section">Job details</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Job title <span className="req">*</span>
                </label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="jobTitle"
                  placeholder="Store Manager"
                  value={staffRegistrationForm.jobTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Department <span className="req">*</span>
                </label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="department"
                  placeholder="Seafood"
                  value={staffRegistrationForm.department}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Salary (USD)</label>
                <input
                  className="form-control-custom"
                  type="number"
                  name="salary"
                  placeholder="45000"
                  min="0"
                  value={staffRegistrationForm.salary || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hire date</label>
              <input
                className="form-control-custom"
                type="date"
                name="hiredAt"
                value={staffRegistrationForm.hiredAt}
                onChange={handleInputChange}
              />
            </div>

            {/* Address */}
            <div className="form-section">Address</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Street</label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="street"
                  placeholder="123 Main St"
                  value={staffRegistrationForm.address.street}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="city"
                  placeholder="Praia"
                  value={staffRegistrationForm.address.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Zone</label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="zone"
                  placeholder="Zone A"
                  value={staffRegistrationForm.address.zone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Island</label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="island"
                  placeholder="Santiago"
                  value={staffRegistrationForm.address.island}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal code</label>
                <input
                  className="form-control-custom"
                  type="text"
                  name="postalCode"
                  placeholder="7600"
                  value={staffRegistrationForm.address.postalCode}
                  onChange={handleInputChange}
                />
              </div>
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
                    checked={staffRegistrationForm.assignedPermissions.includes(
                      perm.value,
                    )}
                    onChange={() => handlePermissionToggle(perm.value)}
                  />
                  <label htmlFor={`perm-${perm.value}`}>
                    {perm.label}
                    <small>{perm.description}</small>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-secondary-custom" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-primary-custom"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Saving ..."
              ) : (
                <>
                  <i className="bi bi-check2"></i> Save Staff
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default StaffModal;
