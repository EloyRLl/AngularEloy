import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router'; 
import { ZonaServicioService } from '@app/services/zona-servicio.service'; 

@Component({
  selector: 'app-zona-servicio-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './zona-servicio-form.component.html'
})
export class ZonaServicioFormComponent implements OnInit {
  form!: FormGroup;
  
  listaRegistros: any[] = []; 
  registroSeleccionado: any = null;

  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(
    private fb: FormBuilder, 
    private service: ZonaServicioService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      operacion: ['insert'],
      id: [''],
      geom: [''], 
      nombre: ['Zona Centro'],
      poblacion_afectada: [5000],
      fecha_creacion: ['2023-01-01'],
      responsable: ['Ayuntamiento'],
      activa: [true]
    });

    // Leer URL para rellenar coordenadas
    this.route.queryParams.subscribe(params => {
      if (params['geom']) {
        this.form.patchValue({
          geom: params['geom'],
          operacion: 'insert'
        });
        this.mensajeExito = '📍 Coordenadas de la Zona capturadas del mapa.';
      }
    });
  }

  procesarError(err: any) {
    console.error('❌ Error completo:', err);
    if (err.error && typeof err.error === 'object') {
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
        this.form.patchValue({ operacion: 'update' });
        this.mensajeExito = '✅ Datos cargados correctamente listos para editar.';
      },
      error: (err: any) => this.procesarError(err)
    });
  }

  onSubmit() {
    const { operacion, id, ...payload } = this.form.value;

    this.registroSeleccionado = null;
    this.listaRegistros = [];
    this.mensajeError = '';
    this.mensajeExito = '';

    switch (operacion) {
      case 'insert':
        this.service.create(payload).subscribe({
          next: (res: any) => this.mensajeExito = '✅ Zona de Servicio creada con éxito.',
          error: (err: any) => this.procesarError(err) 
        });
        break;
      case 'update':
        this.service.update(id, payload).subscribe({
          next: (res: any) => this.mensajeExito = '✅ Zona de Servicio actualizada.',
          error: (err: any) => this.procesarError(err)
        });
        break;
      case 'delete':
        this.service.delete(id).subscribe({
          next: (res: any) => this.mensajeExito = '🗑️ Zona de Servicio eliminada.',
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