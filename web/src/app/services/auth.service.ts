import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ajusta el puerto al que usa tu Django
  private apiUrl = 'http://localhost:8888'; 
  
  
  // 1. Sujeto reactivo que mantiene el nombre del usuario y avisa al Navbar
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  // 2. Variable booleana pública que resuelve tu error TS2339
  public isAuthenticated: boolean = !!localStorage.getItem('token');

  constructor(private http: HttpClient) {
    this.checkIsLoggedIn();
  }



  // 3. ✨ GETTERS Y SETTERS MÁGICOS ✨
  // Cuando en tu login haces "this.authService.username = ...", Angular ejecuta esto
  // y lanza la señal (.next) al Navbar para que aparezca el nombre al instante.
  set username(name: string | null) {
    this.currentUserSubject.next(name);
  }

  // Permite leer el nombre si en algún momento haces "console.log(this.authService.username)"
  get username(): string | null {
    return this.currentUserSubject.value;
  }

  // 4. REQUISITO DEL PDF: Comprobar la sesión al entrar en la web
  checkIsLoggedIn(): void {
    console.log('--- INICIANDO COMPROBACIÓN DE SESIÓN (F5) ---');
    const token = localStorage.getItem('token');
    
    console.log('1. Token encontrado en memoria:', token);

    // Si no hay token, o se guardó literalmente la palabra "undefined"
    if (!token || token === 'undefined' || token === 'null') {
      console.log('2. No hay token válido. Haciendo logout limpio.');
      this.logout();
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });
    console.log('3. Preguntando a Django en /core/isLoggedIn/ ...');
    
    this.http.get<{is_logged_in: boolean, username: string}>(`${this.apiUrl}/core/isLoggedIn/`, { headers })
      .subscribe({
        next: (response) => {
          console.log('✅ 4. ¡Django dice OK! Usuario:', response.username);
          this.isAuthenticated = true;
          this.username = response.username; 
        },
        error: (err) => {
          console.error('❌ 4. Django ha rechazado el token. Motivo:', err.status, err.message);
          // Si Django lo rechaza, borramos la sesión
          this.logout();
        }
      });
  }

  // 5. CERRAR SESIÓN
logout() {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Preparamos la cabecera con el token
      const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });

      // Llamamos al logout de Knox enviando un POST vacío {}
      this.http.post('http://localhost:8888/core/knox_logout/', {}, { headers })
        .subscribe({
          next: () => {
            console.log('✅ Token destruido correctamente en Django.');
            this.limpiarSesionLocal();
          },
          error: (err) => {
            console.error('⚠️ Error en Django, pero cerramos sesión localmente igual:', err);
            this.limpiarSesionLocal(); // Forzamos el borrado por si el servidor falla
          }
        });
    } else {
      // Si no había token, simplemente limpiamos
      this.limpiarSesionLocal();
    }
  }

  // Función de apoyo para no repetir código
  private limpiarSesionLocal() {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.username = '';
    
    // Si tienes inyectado el Router en el servicio, te mandamos al login:
    // this.router.navigate(['/login-form']);
  }
}