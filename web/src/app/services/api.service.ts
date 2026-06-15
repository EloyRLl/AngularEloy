import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })

  constructor(public settingsService: SettingsService, private httpClient: HttpClient) { }

  get(endPointUrl: string, getParams: HttpParams = new HttpParams({})) {
    return this.httpClient.get<any>(this.settingsService.API_URL + endPointUrl,
      {
        headers: this.headers,
        responseType: 'json',
        reportProgress: false,
        params: getParams,
        withCredentials: true, //withCredentials. Necessary to send cookies: sessionid, csrf, ...
      })
  }

  post(endPointUrl: string, postParams: {} = {}) {
    var postData = this.generarHttpParamsDesdeObjeto(postParams);
    return this.httpClient.post<any>(
      this.settingsService.API_URL + endPointUrl,
      postData,
      {
        headers: this.headers,
        responseType: 'json',
        reportProgress: false,
        withCredentials: true, //withCredentials. Necessary to send cookies: sessionid, csrf, ...
      }
    )
  }

  // --- MÉTODOS AÑADIDOS PARA LA PRÁCTICA ---

  put(endPointUrl: string, postParams: {} = {}) {
    var postData = this.generarHttpParamsDesdeObjeto(postParams);
    return this.httpClient.put<any>(
      this.settingsService.API_URL + endPointUrl,
      postData,
      { 
        headers: this.headers, 
        responseType: 'json', 
        reportProgress: false, 
        withCredentials: true 
      }
    );
  }

  delete(endPointUrl: string) {
    return this.httpClient.delete<any>(
      this.settingsService.API_URL + endPointUrl,
      { 
        headers: this.headers, 
        responseType: 'json', 
        reportProgress: false, 
        withCredentials: true 
      }
    );
  }

  // ------------------------------------------

  private generarHttpParamsDesdeObjeto(data: { [key: string]: string | number }): string {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.set(key, data[key].toString());
      }
    }
    return params.toString();
  }
}