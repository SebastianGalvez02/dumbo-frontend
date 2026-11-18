import type {
  CreateProductInput,
  ImportProductInput,
  ImportProductsResult,
  Product,
} from "@/types/product";

export interface ProductService {
  create(input: CreateProductInput): Promise<Product>;

  importProducts(
    input: ImportProductInput,
  ): Promise<ImportProductsResult>;
}