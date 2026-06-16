import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router'; 
import { ArquetaPozoService } from '@app/services/arqueta-pozo.service'; 

@Component({
  selector: 'app-arqueta-pozo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './arqueta-pozo-form.component.html'
})
export class ArquetaPozoFormComponent implements OnInit {
  form!: FormGroup;
  
  listaRegistros: any[] = []; 
  registroSeleccionado: any = null;

  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(
    private fb: FormBuilder, 
    private service: ArquetaPozoService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      operacion: ['insert'],
      id: [''],
      geom: [''], 
      tipo_elemento: [1], // NOTA: Aquí igual hay que poner un ID en vez de un texto por la clave foránea
      profundidad: [2.5],
      fecha_mantenimiento: ['2023-06-15'],
      accesible: [true],
      estado_conservacion: [1] // NOTA: Igual aquí, poner ID (ej. 1) temporalmente
    });

    // Leer URL para rellenar coordenadas
    this.route.queryParams.subscribe(params => {
      if (params['geom']) {
        this.form.patchValue({
          geom: params['geom'],
          operacion: 'insert'
        });
        this.mensajeExito = '📍 Coordenadas de la Arqueta capturadas del mapa.';
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
          next: (res: any) => this.mensajeExito = '✅ Arqueta creada con éxito.',
          error: (err: any) => this.procesarError(err) 
        });
        break;
      case 'update':
        this.service.update(id, payload).subscribe({
          next: (res: any) => this.mensajeExito = '✅ Arqueta actualizada.',
          error: (err: any) => this.procesarError(err)
        });
        break;
      case 'delete':
        this.service.delete(id).subscribe({
          next: (res: any) => this.mensajeExito = '🗑️ Arqueta eliminada.',
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