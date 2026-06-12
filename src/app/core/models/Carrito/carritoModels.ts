export interface AgregarCarrito {
  idCliente: number;
  idProducto: number;
  cantidad: number;
}

export interface Carrito {
  id: number;
  idCliente: number;
  items: CarritoItem[];
}

export interface CarritoItem {
  idProducto: number;
  cantidad: number;
}