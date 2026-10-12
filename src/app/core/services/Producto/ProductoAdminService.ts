import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Producto, ProductoAdmin, ProductoRequest } from '@core/models/Producto/productoModels';

@Injectable({ providedIn: 'root' })
export class ProductoAdminService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/admin/productos`;

  obtener(id: number): Observable<ProductoAdmin> {
    return this.http.get<ProductoAdmin>(`${this.url}/${id}`);
  }

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

  subirImagen(id: number, file: File): Observable<ProductoAdmin> {
    const formData = new FormData();
    formData.append('file', file); // debe coincidir con @RequestParam("file")
    return this.http.post<ProductoAdmin>(`${this.url}/${id}/imagen`, formData);
  }
}