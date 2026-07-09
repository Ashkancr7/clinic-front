export type Role = "patient" | "doctor" | "receptionist" | "clinic_admin" | "superadmin";

export const ROLE_HOME_ROUTE: Record<Role, string> = {
  patient: "/select-clinic",
  doctor: "/select-clinic",
  receptionist: "/select-clinic",
  clinic_admin: "/select-clinic",
  superadmin: "/super-admin/clinics",
};

export function canAccessClinicPanel(role: Role) {
  return role === "doctor" || role === "receptionist" || role === "clinic_admin";
}

export function canAccessPatientPanel(role: Role) {
  return role === "patient";
}
