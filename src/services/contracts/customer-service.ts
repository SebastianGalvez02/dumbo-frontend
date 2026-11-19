import type {
  Customer,
  RegisterCustomerInput,
} from "@/types/users";

export interface CustomerService {
  list(): Promise<Customer[]>;

  register(input: RegisterCustomerInput): Promise<Customer>;

  registerByEmployee(
    input: RegisterCustomerInput,
  ): Promise<Customer>;
}
