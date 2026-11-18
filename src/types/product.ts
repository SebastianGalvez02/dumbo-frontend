export interface Product {
    id: number;
    code: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string | null;
    brand: string;
}

export interface CreateProductInput {
    code: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    image?: File;
    brand: string;
}
export interface ImportProductInput {
    file: File;
}
export interface ProductImportError {
    rowNumber: number;
    code?: string;
    messages: string[];
}
export interface ImportProductsResult {
    createdProducts: Product[];
    rejectedRows: ProductImportError[];
}