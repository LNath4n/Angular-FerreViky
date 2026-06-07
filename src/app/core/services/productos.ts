import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Producto } from '@core/models/producto';

@Injectable({
    providedIn: 'root'
})
export class ProductosService {


    private url = `${environment.apiUrl}/productos`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Producto[]> {
        console.log(this.url)
        return this.http.get<Producto[]>(this.url);
    }

    getById(id: number): Observable<Producto> {
        return this.http.get<Producto>(`${this.url}/${id}`);
    }

    getByMarca(marca: string): Observable<Producto[]> {
        return this.http.get<Producto[]>(`${this.url}/marcas/${marca}`);
    }

    getByCategoria(categoria: string): Observable<Producto[]> {
        return this.http.get<Producto[]>(`${this.url}/categorias/${categoria}`);
    }

    create(producto: Producto): Observable<Producto> {
        return this.http.post<Producto>(this.url, producto);
    }


}
