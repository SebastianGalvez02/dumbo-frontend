export interface UserContact {
    name: string;
    lastName: string;
    phone: string;
    mail: string;
}
export interface Customer extends UserContact {
    id: number;
    role: "Cliente";
    isEnabled: boolean;
}
export interface Employee extends UserContact {
    id: number;
    role: "Trabajador";
    isEnabled: boolean;
}
export type RegisterCustomerInput = UserContact;
export type UpdateCostumerInput = Partial<UserContact>;
export type CreateEmployeeInput = UserContact;
export type UpdateEmployeeInput = Partial<UserContact>;

export interface ChangeAccountStatusInput {
    isEnabled: boolean;
}