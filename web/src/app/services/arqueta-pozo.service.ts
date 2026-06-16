import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArquetaPozoService {
  private apiUrl = 'http://localhost:8888/api/arquetas_pozos';

  constructor(private http: HttpClient) {}

  private getOptions() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    // Si llegara a existir un token real, lo enviamos, ignorando los "undefined"
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      headers = headers.set('Authorization', `Token ${token}`);
    }

    return { 
      headers: headers,
      withCredentials: true // Esto envía tu Cookie de sesión de Django ("User admin logged in")
    };
  }

  getAll(): Observable<any> { return this.http.get(`${this.apiUrl}/`, this.getOptions()); }
  getById(id: number): Observable<any> { return this.http.get(`${this.apiUrl}/${id}/`, this.getOptions()); }
  create(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/`, data, this.getOptions()); }
  update(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}/`, data, this.getOptions()); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}/`, this.getOptions()); }
}