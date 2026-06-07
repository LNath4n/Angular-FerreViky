import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { LoginClienteDto, CreacionClienteRespuestaDto } from '@core/models/cliente';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private url = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  login(dto: LoginClienteDto): Observable<string> {
    return this.http.post(`${this.url}/login`, dto, { responseType: 'text' });
  }

  create(dto: LoginClienteDto): Observable<CreacionClienteRespuestaDto> {
    return this.http.post<CreacionClienteRespuestaDto>(this.url, dto);
  }
}