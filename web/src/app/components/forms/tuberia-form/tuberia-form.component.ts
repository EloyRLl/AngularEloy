import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router'; // ✨ Para las coordenadas del mapa
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

  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(
    private fb: FormBuilder, 
    private service: TuberiaService,
    private route: ActivatedRoute
  ) {}

  materiales: any[] = []; // ✨ Lista para el desplegable

  ngOnInit(): void {
    this.form = this.fb.group({
      operacion: ['insert'],
      id: [''],
      geom: [''],
      tamano_tubo: [250],
      material: [''], // Lo dejamos vacío
      presion_maxima: [10.5],
      fecha_instalacion: ['2023-01-15'],
      estado: ['Bueno']
    });

    // ✨ CARGAMOS LOS MATERIALES AL INICIAR
    this.codelistService.getMaterialesTuberia().subscribe({
      next: (data: any) => {
        this.materiales = data.results ? data.results : data;
      },
      error: (err) => console.error('Error cargando materiales', err)
    });

    // Detectar si venimos del mapa y rellenar coordenadas
    this.route.queryParams.subscribe(params => {
      if (params['geom']) {
        this.form.patchValue({
          geom: params['geom'],
          operacion: 'insert'
        });
        this.mensajeExito = '📍 Coordenadas capturadas del mapa listas para insertar.';
      }
    });
  }

  procesarError(err: any) {
    console.error('❌ Error completo:', err);
    
    if (err.error && typeof err.error === 'object') {
      let mensajes: string[] = [];
      
      // Recorremos las claves del error que envía Django
      for (const key in err.error) {
        if (Array.isArray(err.error[key])) {
          // Si es un array de errores para un campo concreto
          mensajes.push(`[${key.toUpperCase()}]: ${err.error[key].join(', ')}`);
        } else if (typeof err.error[key] === 'string') {
          // Si es un texto directo (ej: "detail": "No autenticado")
          mensajes.push(err.error[key]);
        } else {
          // Si es otro objeto más profundo, lo convertimos a texto real para que no ponga [object Object]
          mensajes.push(`[${key.toUpperCase()}]: ${JSON.stringify(err.error[key])}`);
        }
      }
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
          next: (res: any) => this.mensajeExito = '✅ Tubería creada con éxito.',
          error: (err: any) => this.procesarError(err) 
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
            // Manejamos la respuesta según si Django envía Paginación o Array directo
            if (data && data.results) {
              this.listaRegistros = data.results;
            } else if (Array.isArray(data)) {
              this.listaRegistros = data;
            } else {
              this.listaRegistros = [data]; // Por si acaso devuelve un solo objeto
            }

            if (this.listaRegistros.length === 0) {
              this.mensajeExito = '✅ La búsqueda se realizó, pero la tabla está vacía.';
            } else {
              this.mensajeExito = `✅ Se encontraron ${this.listaRegistros.length} registros.`;
            }
          },
          error: (err: any) => this.procesarError(err)
        });
        break;
    }
  }
}