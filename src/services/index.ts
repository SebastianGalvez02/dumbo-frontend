import { mockControls, mockServices } from "@/mocks/mock-services";

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

const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

function getServices(): Services {
  switch (dataSource) {
    case "mock":
      return mockServices;
    case "api":
      throw new Error("El adaptador API de Dumbo aún no está disponible. Usa NEXT_PUBLIC_DATA_SOURCE=mock.");
    default:
      throw new Error("NEXT_PUBLIC_DATA_SOURCE debe ser mock o api.");
  }
}

export const services = getServices();

export function getDevelopmentResetLink(mail: string): string | null {
  if (process.env.NODE_ENV !== "development") return null;
  return mockControls.getResetLink(mail);
}
