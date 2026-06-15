import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
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

  // Variables para los mensajes en pantalla
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private fb: FormBuilder, private service: ArquetaPozoService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      operacion: ['insert'],
      id: [''],
      geom: ['POINT(2.5 2.5)'], 
      tipo_elemento: ['Arqueta'],
      profundidad: [1.80],
      fecha_mantenimiento: ['2023-11-01'],
      accesible: [true],
      estado_conservacion: ['Excelente']
    });
  }

  // Función para extraer el error exacto de Django
procesarError(err: any) {
    console.error('❌ Error completo:', err);
    
    if (err.error) {
      if (typeof err.error === 'string') {
        this.mensajeError = err.error;
      } else {
        // Función recursiva que bucea en el objeto buscando los textos
        let mensajes: string[] = [];
        const extraerTextos = (obj: any) => {
          if (typeof obj === 'string') {
            mensajes.push(obj);
          } else if (Array.isArray(obj)) {
            obj.forEach(extraerTextos);
          } else if (typeof obj === 'object' && obj !== null) {
            Object.values(obj).forEach(extraerTextos);
          }
        };
        
        extraerTextos(err.error);
        
        // Si logró sacar textos los une, si no, lo pasa a texto bruto para no ver [object Object]
        this.mensajeError = mensajes.length > 0 
          ? mensajes.join(' | ') 
          : JSON.stringify(err.error);
      }
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

    this.registroSeleccionado = null;
    this.listaRegistros = [];
    this.mensajeError = '';
    this.mensajeExito = '';

    switch (operacion) {
      case 'insert':
        this.service.create(payload).subscribe({
          next: (res: any) => this.mensajeExito = '✅ Arqueta/Pozo creado con éxito.',
          error: (err: any) => this.procesarError(err)
        });
        break;
      case 'update':
        this.service.update(id, payload).subscribe({
          next: (res: any) => this.mensajeExito = '✅ Arqueta/Pozo actualizado.',
          error: (err: any) => this.procesarError(err)
        });
        break;
      case 'delete':
        this.service.delete(id).subscribe({
          next: (res: any) => this.mensajeExito = '🗑️ Arqueta/Pozo eliminado.',
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
            this.mensajeExito = `✅ Se encontraron ${this.listaRegistros.length} elementos.`;
          },
          error: (err: any) => this.procesarError(err)
        });
        break;
    }
  }
}