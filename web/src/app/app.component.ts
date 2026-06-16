import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Añadido
    RouterModule, 
    MatSidenavModule, 
    MatButtonModule, 
    MatIconModule, 
    HeaderComponent, 
    NavbarComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  toggleSidenav() {
    this.sidenav.toggle();
  }
}