import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodelistService {
  // Ajusta esta URL si tu backend no responde en el puerto 8888
  private baseUrl = 'http://localhost:8888/codelist';

  constructor(private http: HttpClient) {}

  getMaterialesTuberia(): Observable<any> {
    return this.http.get(`${this.baseUrl}/materialtuberia/`);
  }
}