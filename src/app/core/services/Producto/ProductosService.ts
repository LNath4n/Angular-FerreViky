import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Producto, PageResponse } from '@core/models/Producto/productoModels';
import { GrupoPublico, GrupoAdmin, GrupoOpcion } from '@core/models/Producto/productoModels';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/productos`;

  getAll(page: number = 0, size: number = 50): Observable<PageResponse<Producto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Producto>>(this.url, { params });
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }


  getAllGrupos(page: number = 0, size: number = 50): Observable<PageResponse<GrupoPublico>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<GrupoPublico>>(`${this.url}/grupos`, { params });
  }


  getGrupoById(id: number): Observable<GrupoPublico> {
    return this.http.get<GrupoPublico>(`${this.url}/grupos/${id}`);
  }

  buscar(
    filtros: { q?: string; marca?: string; grupoId?: number },
    page: number = 0,
    size: number = 20
  ): Observable<PageResponse<Producto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    const q = filtros.q?.trim();
    if (q) params = params.set('q', q);
    if (filtros.marca) params = params.set('marca', filtros.marca);
    if (filtros.grupoId != null) params = params.set('grupoId', filtros.grupoId.toString());

    return this.http.get<PageResponse<Producto>>(`${this.url}/buscar`, { params });
  }

  obtenerMarcas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/marcas`);
  }

  obtenerListaGrupos(): Observable<GrupoOpcion[]> {
    return this.http.get<GrupoOpcion[]>(`${this.url}/grupos/lista`);
  }
}