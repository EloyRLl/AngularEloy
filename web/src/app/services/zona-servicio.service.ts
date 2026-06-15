import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ZonaServicioService {
  // Ajusta esta URL a la que corresponda en tu API de Django
  private apiUrl = 'http://localhost:8888/api/zonas_servicio'; 

  constructor(private http: HttpClient) {}

  create(data: any) { return this.http.post(`${this.apiUrl}/`, data); }
  update(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}/`, data); }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}/`); }
  getById(id: number) { return this.http.get(`${this.apiUrl}/${id}/`); }
  getAll(): Observable<any> { return this.http.get(this.apiUrl + '/'); }
}