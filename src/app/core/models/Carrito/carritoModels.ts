export interface AgregarCarrito {
  idProducto: number;
  cantidad: number;
}

export interface CarritoProducto {
  productoId: number;
  descripcion: string;
  clave: string;
  cantidad: number;
  precioPublicoIva: number;
  imagenUrl: string | null;
}

export interface Carrito {
  id: number;
  emailCliente: string;
  productos: CarritoProducto[];
  fechaCreacion: string;
  subtotal: number;
}