import type {
  ChangeAccountStatusInput,
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeInput,
} from "@/types/users";

export interface EmployeeService {
  list(): Promise<Employee[]>;

  create(input: CreateEmployeeInput): Promise<Employee>;

  update(
    employeeId: number,
    input: UpdateEmployeeInput,
  ): Promise<Employee>;

  changeStatus(
    employeeId: number,
    input: ChangeAccountStatusInput,
  ): Promise<Employee>;
}