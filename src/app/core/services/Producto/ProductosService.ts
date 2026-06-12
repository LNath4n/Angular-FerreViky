import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Producto } from '@core/models/Producto/productoModels';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProductosService {


    private url = `${environment.apiUrl}/productos`;

    constructor(private http: HttpClient) { } //Inyeccion de dependencias igual que el de Spring 

    getAll(): Observable<Producto[]> { //Un Observable es un objeto que puede emitir valores a lo largo del tiempo
        return this.http.get<Producto[]>(this.url);
        
    } //La sintaxis de un get es this.http.get<T>(url)
    //El <T> es un OBJETO GENERICO, no sabremos que Objeto es hasta ejecutarlo
    //Asi es como funcionan las linkedList en Java List<T>,Ya cuando lo instanciamos sabremos que por ejemplo es String

    //En funciones primero va el nombre del valor luego el tipo, opuesto a Java
    //Java      int x;
    //Angular   x: number;
    getById(id: number): Observable<Producto> {
        return this.http.get<Producto>(`${this.url}/${id}`);
    } //Se usa esta forma "rara" de concatenar en angular para mas legibilidad 

    getByMarca(marca: string): Observable<Producto[]> { //<- En angular aqui va lo que regresa la funcion en este caso un Arreglo de objetos Productos
        return this.http.get<Producto[]>(`${this.url}/marcas/${marca}`);
    }

    getByCategoria(categoria: string): Observable<Producto[]> {
        return this.http.get<Producto[]>(`${this.url}/categorias/${categoria}`); // El <Producto[]> significa que es lo que va a regresar el server
    }

    create(producto: Producto): Observable<Producto> {
        return this.http.post<Producto>(this.url, producto); //El sevidor me va a regresar un PRODUCTO
    }

    buqueda(marca: string, categoria: string, precioMax: number, precioMin: number, nombre: string): Observable<Producto[]> {
        const params = new HttpParams()
            .set('marca', marca)
            .set('categoria', categoria)
            .set('precioMax', precioMax.toString())
            .set('precioMin', precioMin.toString())
            .set('nombre', nombre);
        return this.http.get<Producto[]>(`${this.url}/busqueda`, { params });
    }

    obtenerMarcas():Observable<string[]>{
        return this.http.get<string[]>(`${this.url}/marcas`);
    }

    obtenerCategorias():Observable<string[]>{
        return this.http.get<string[]>(`${this.url}/categorias`);
    }




}
