
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Carrito,AgregarCarrito } from '@core/models/Carrito/carritoModels';

@Injectable({ providedIn: 'root' })
export class CarritosService {
    private url = `${environment.apiUrl}/carrito`;

    constructor(private http: HttpClient) { }

    agregar(dto: AgregarCarrito): Observable<string> {
        return this.http.post(`${this.url}`, dto, { responseType: 'text' });
    }

    obtenerPorId(id: number): Observable<Carrito> {
        return this.http.get<Carrito>(`${this.url}/${id}`);
    }
}
