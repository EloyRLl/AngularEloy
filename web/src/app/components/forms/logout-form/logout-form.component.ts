import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router'; // Añadimos el Router por si quieres redirigir

@Component({
  selector: 'app-logout-form',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './logout-form.component.html',
  styleUrl: './logout-form.component.scss'
})
export class LogoutFormComponent {
  serverMessage = '';
  
  // Inyectamos el AuthService y el Router
  constructor(
    private authService: AuthService, 
    private router: Router
  ){}
  
  logout(){
    // Llamamos al método que ya tienes en auth.service.ts
    // Ese método ya borra el token, cambia isAuthenticated a false y avisa a Django
    this.authService.logout();
    
    this.serverMessage = "Sesión cerrada correctamente.";
    
    // Opcionalmente, te redirige a la página principal o al login después de salir
    this.router.navigate(['/']); 
  }
}