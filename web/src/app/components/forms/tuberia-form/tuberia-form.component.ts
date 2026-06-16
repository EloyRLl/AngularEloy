import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TuberiaService } from '@app/services/tuberia.service'; 

@Component({
  selector: 'app-tuberia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './tuberia-form.component.html'
})
export class TuberiaFormComponent implements OnInit {
  form!: FormGroup;
  
  listaRegistros: any[] = []; 
  registroSeleccionado: any = null;

  // ✨ NUEVAS VARIABLES PARA LOS MENSAJES EN PANTALLA
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private fb: FormBuilder, private service: TuberiaService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      operacion: ['insert'],
      id: [''],
      geom: ['LINESTRING(0 0, 10 10)'],
      tamano_tubo: [250],
      material: ['PVC'],
      presion_maxima: [10.5],
      fecha_instalacion: ['2023-01-15'],
      estado: ['Bueno']
    });
  }

  // ✨ NUEVA FUNCIÓN: Extrae el error exacto que envía Django
  procesarError(err: any) {
    console.error('❌ Error completo:', err);
    if (err.error && typeof err.error === 'object') {
      // Django suele mandar {"geom": ["Error espacial"], "otro": ["..."]}
      // Esto junta todos los mensajes en un solo texto legible
      const mensajes = Object.values(err.error).flat();
      this.mensajeError = mensajes.join(' | ');
    } else if (err.error && typeof err.error === 'string') {
      this.mensajeError = err.error;
    } else {
      this.mensajeError = err.message || 'Error desconocido del servidor.';
    }
  }

  cargarRegistro() {
    this.mensajeError = '';
    this.mensajeExito = '';
    const id = this.form.value.id;
    if (!id) {
      this.mensajeError = 'Por favor, escribe un ID primero.';
      return;
    }

    this.service.getById(id).subscribe({
      next: (data: any) => {
        this.form.patchValue(data);
        this.mensajeExito = '✅ Datos cargados correctamente.';
      },
      error: (err: any) => this.procesarError(err)
    });
  }

  onSubmit() {
    const { operacion, id, ...payload } = this.form.value;

    // Limpiamos la pantalla visual al ejecutar una nueva acción
    this.registroSeleccionado = null;
    this.listaRegistros = [];
    this.mensajeError = '';
    this.mensajeExito = '';

    switch (operacion) {
      case 'insert':
        this.service.create(payload).subscribe({
          next: (res: any) => this.mensajeExito = '✅ Tubería creada con éxito.',
          error: (err: any) => this.procesarError(err) // Usamos la nueva función
        });
        break;
      case 'update':
        this.service.update(id, payload).subscribe({
          next: (res: any) => this.mensajeExito = '✅ Tubería actualizada con éxito.',
          error: (err: any) => this.procesarError(err)
        });
        break;
      case 'delete':
        this.service.delete(id).subscribe({
          next: (res: any) => this.mensajeExito = '🗑️ Tubería eliminada con éxito.',
          error: (err: any) => this.procesarError(err)
        });
        break;
      case 'select':
        this.service.getById(id).subscribe({
          next: (data: any) => {
            this.registroSeleccionado = data;
            this.mensajeExito = '✅ Búsqueda completada.';
          },
          error: (err: any) => this.procesarError(err)
        });
        break;
      case 'selectAll':
        this.service.getAll().subscribe({
          next: (data: any) => {
            this.listaRegistros = data.results ? data.results : data;
            this.mensajeExito = `✅ Se encontraron ${this.listaRegistros.length} registros.`;
          },
          error: (err: any) => this.procesarError(err)
        });
        break;
    }
  }
}