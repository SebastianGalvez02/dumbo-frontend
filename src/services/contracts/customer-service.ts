import type {
  Customer,
  RegisterCustomerInput,
} from "@/types/users";

export interface CustomerService {
  register(input: RegisterCustomerInput): Promise<Customer>;

  registerByEmployee(
    input: RegisterCustomerInput,
  ): Promise<Customer>;
}