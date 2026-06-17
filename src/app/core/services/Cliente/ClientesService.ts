import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { LoginClienteDto, CreacionClienteRespuestaDto, LoginResponse} from '@core/models/Cliente/clienteModels';


@Injectable({ providedIn: 'root' })
export class ClientesService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(dto: LoginClienteDto): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.url}/login`, dto);
  }

  create(dto: LoginClienteDto): Observable<CreacionClienteRespuestaDto> {
    return this.http.post<CreacionClienteRespuestaDto>(this.url, dto);
  }
}