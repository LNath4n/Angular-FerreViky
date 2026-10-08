import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Producto, ProductoRequest } from '@core/models/Producto/productoModels';
import { ProductoAdmin } from '@core/models/Producto/productoModels';
@Injectable({ providedIn: 'root' })
export class ProductoAdminService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/admin/productos`;

  crear(body: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.url, body);
  }

  editar(id: number, body: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, body);
  }

  borrar(id: number): Observable<string> {
    // El backend devuelve un String plano, no JSON
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  obtener(id: number) {
    return this.http.get<ProductoAdmin>(`${this.url}/${id}`);
  }
}