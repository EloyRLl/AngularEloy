import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  // Inyectamos el AuthService como 'public' para poder acceder a 
  // sus variables (isAuthenticated y username) directamente desde el HTML
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Tu AuthService ya hace la petición automática en su constructor,
    // pero podemos forzarla aquí también al cargar el componente 
    // por si el estado cambia.
    this.authService.checkIsLoggedIn();
  }
}