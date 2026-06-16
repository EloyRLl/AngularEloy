import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Al cargar la barra, comprobamos si ya hay un token válido
    this.authService.checkIsLoggedIn();

    // 2. Nos suscribimos al observable para actualizar la vista en tiempo real
    this.authService.currentUser$.subscribe((name) => {
      this.username = name;
    });
  }

  hacerLogout() {
    // 1. Le pedimos al servicio que se encargue de destruir el token
    this.authService.logout();
    
    // 2. Te mandamos de vuelta al formulario de login
    this.router.navigate(['/login-form']);
  }
}