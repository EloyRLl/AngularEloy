import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArquetaPozoService {
  // Ojo a la URL: arquetas_pozos
  private apiUrl = 'http://localhost:8888/api/arquetas_pozos';

  // ... (El resto de métodos get, post, put, delete son exactamente iguales que arriba) ...
  constructor(private http: HttpClient) {}
  getAll(): Observable<any> { return this.http.get(this.apiUrl + '/'); }
  getById(id: number): Observable<any> { return this.http.get(`${this.apiUrl}/${id}/`); }
  create(data: any): Observable<any> { return this.http.post(this.apiUrl + '/', data); }
  update(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}/`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}/`); }
}