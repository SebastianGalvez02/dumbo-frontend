import type { Role } from "@/types/role";
import type { UserContact } from "@/types/users";
import type {
  CreateProductInput,
  Product,
} from "@/types/product";

import { ServiceError } from "@/services/contracts/service-error";

export interface MockAccount extends UserContact {
  id: number;
  role: Role;
  isEnabled: boolean;
  password: string;
  hasToChangePassword: boolean;
}

export const initialAccounts: MockAccount[] = [
  {
    id: 1,
    name: "Ana",
    lastName: "Torres",
    phone: "900000001",
    mail: "admin@dumbo.test",
    role: "Administrador",
    isEnabled: true,
    password: "Demo12345",
    hasToChangePassword: false,
  },
  {
    id: 2,
    name: "Pedro",
    lastName: "Soto",
    phone: "900000002",
    mail: "employee@dumbo.test",
    role: "Trabajador",
    isEnabled: true,
    password: "Demo12345",
    hasToChangePassword: false,
  },
  {
    id: 3,
    name: "Maria",
    lastName: "Perez",
    phone: "900000003",
    mail: "customer@dumbo.test",
    role: "Cliente",
    isEnabled: true,
    password: "mariaperez",
    hasToChangePassword: true,
  },
  {
    id: 4,
    name: "Luis",
    lastName: "Diaz",
    phone: "900000004",
    mail: "disabled@dumbo.test",
    role: "Cliente",
    isEnabled: false,
    password: "Demo12345",
    hasToChangePassword: false,
  },
];

export const initialProducts: Product[] = [
  {
    id: 1,
    code: "DEMO-001",
    name: "Arroz",
    description: "Arroz de ejemplo",
    category: "Abarrotes",
    price: 1500,
    stock: 20,
    imageUrl: null,
    brand: "Demo",
  },
];

const sampleProduct: CreateProductInput = {
  code: "IMPORT-001",
  name: "Fideos",
  description: "Producto de ejemplo",
  category: "Abarrotes",
  price: 1000,
  stock: 10,
  brand: "Demo",
};

export function getImportRows(
  fileName: string,
): CreateProductInput[] {
  if (!/\.(csv|xlsx|xls)$/i.test(fileName)) {
    throw new ServiceError(
      "INVALID_FILE",
      "Selecciona un archivo Excel o CSV.",
    );
  }

  const scenario = fileName
    .replace(/\.(csv|xlsx|xls)$/i, "")
    .toLowerCase();

  switch (scenario) {
    case "products-valid":
      return [
        { ...sampleProduct },
        {
          ...sampleProduct,
          code: "IMPORT-002",
          name: "Lentejas",
        },
      ];

    case "products-mixed":
      return [
        { ...sampleProduct },
        {
          ...sampleProduct,
          code: "IMPORT-002",
          price: -100,
        },
        { ...sampleProduct },
        {
          ...sampleProduct,
          code: "",
          name: "",
        },
      ];

    case "products-invalid":
      return [
        {
          ...sampleProduct,
          code: "",
          price: -1,
        },
        {
          ...sampleProduct,
          code: "IMPORT-002",
          stock: -5,
        },
      ];

    case "products-empty":
      return [];

    default:
      throw new ServiceError(
        "UNKNOWN_FIXTURE",
        "Usa products-valid, products-mixed, products-invalid o products-empty.",
      );
  }
}