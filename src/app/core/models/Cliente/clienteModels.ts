export interface LoginClienteDto {
  email: string;
  password: string;
}

export interface CreacionClienteRespuestaDto {
  id: number;
  email: string;
}
export interface LoginResponse {
  token: string;
}
