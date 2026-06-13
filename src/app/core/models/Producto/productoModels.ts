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
