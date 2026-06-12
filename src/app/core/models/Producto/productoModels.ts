export interface Producto {
  id: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  marca: string;
  precioPublicoIva: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;   
  size: number;
}