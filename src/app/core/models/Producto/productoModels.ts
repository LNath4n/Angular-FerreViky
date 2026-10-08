export interface Producto {
  id: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  marca: string;
  precioPublicoIva: number;
  stock:number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;   
  size: number;
}

export interface GrupoPublico {
  id: number;
  nombre: string;
  productoIds: number[];
}

export interface GrupoAdmin {
  id: number;
  nombre: string;
  prefijoClave: string;
  palabrasComunes: string;
  productoIds: number[];
}

export interface ProductoRequest {
  codigo?: string;
  clave: string; // obligatoria
  descripcion?: string;
  margenMercado?: string;
  caja?: string;
  master?: string;
  unidad?: string;
  ean?: string;
  precioMayoreoIva?: number;
  precioDistribuidorIva?: number;
  precioPublicoIva?: number;
  marca?: string;
  grupoDeProductosId?: number | null;
  stock?: number;
}

export interface ProductoAdmin extends ProductoRequest {
  id: number;
}

export interface GrupoOpcion {
  id: number;
  nombre: string;
}