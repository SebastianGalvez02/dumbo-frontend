import type { AuthenticationService } from "./contracts/authentication-service";
import type { CustomerService } from "./contracts/customer-service";
import type { EmployeeService } from "./contracts/employee-service";
import type { ProductService } from "./contracts/product-service";

export type { AuthenticationService } from "./contracts/authentication-service";
export type { CustomerService } from "./contracts/customer-service";
export type { EmployeeService } from "./contracts/employee-service";
export type { ProductService } from "./contracts/product-service";

export interface Services {
  authentication: AuthenticationService;
  customers: CustomerService;
  employees: EmployeeService;
  products: ProductService;
}