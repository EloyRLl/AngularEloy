import { Component } from '@angular/core';

// To use forms 
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatTooltip } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

// To use the controls in the component
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';

// 1️⃣ IMPORTAMOS EL ENRUTADOR PARA PODER VIAJAR AL MAPA
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login-form', // Cambiado de 'app-login.form' a 'app-login-form' por convención
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatTooltip, MatButtonModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  serverMessage = '';
  
  // Form component creation
  username = new FormControl('', [Validators.required, Validators.minLength(4)]);
  password =  new FormControl('', [Validators.required, Validators.minLength(4)]);

  // Create a form group to eval the data at once
  controlsGroup = new FormGroup({
    username: this.username,
    password: this.password,
  });

  // 2️⃣ INYECTAMOS EL ROUTER EN EL CONSTRUCTOR
  constructor(
    private apiService: ApiService, 
    private authService: AuthService,
    private router: Router 
  ) {}

  login() {
    this.serverMessage = '';

    this.apiService.post('core/knox_login/', this.controlsGroup.value).subscribe({
      next: (response: any) => { 
        console.log('Respuesta de Django al hacer login:', response);

        // ¡Volvemos a tu lógica original! Buscamos el token dentro del array "data"
        if (response.data && response.data.length > 0 && response.data[0].token) {
          
          const token = response.data[0].token;
          
          // Guardamos la llave maestra
          localStorage.setItem('token', token); 
          
          this.authService.username = this.username.value!; 
          this.authService.isAuthenticated = true;
          this.serverMessage = '✅ Has iniciado sesión correctamente.';
          
          console.log('✅ ¡Token guardado correctamente! Ya puedes pulsar F5.');
          
          // Viajamos al mapa
          this.router.navigate(['/map']);
          
        } else {
          console.error('No se ha encontrado el token dentro de response.data:', response);
          this.serverMessage = '❌ Error inesperado al leer el token de la base de datos.';
        }
      },
      error: (error: any) => {
        console.error('Error en login:', error);
        this.serverMessage = '❌ Credenciales incorrectas.';
      }
    });
  }
}