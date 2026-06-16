import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../services/map.service';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../models/event.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Draw from 'ol/interaction/Draw';
import WKT from 'ol/format/WKT';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'app-draw-arqueta-pozo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button *ngIf="authService.isAuthenticated" (click)="toggleDraw()" [ngClass]="{'active': isDrawing}" style="margin-bottom: 5px; cursor: pointer;">
      {{ isDrawing ? '🛑 Parar Arqueta' : '📍 Dibujar Arqueta' }}
    </button>
  `,
  styles: [`
    .active { background-color: lightcoral; font-weight: bold; color: white; }
    button { padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc; }
  `]
})
export class DrawArquetaPozoComponent implements OnInit, OnDestroy {
  drawInteraction!: Draw;
  isDrawing: boolean = false;
  private eventSub!: Subscription;

  constructor(
    private mapService: MapService, 
    private router: Router,
    public authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    // Escucha eventos de los otros botones
    this.eventSub = this.eventService.eventActivated$.subscribe((event: EventModel) => {
      if (event.type === 'STOP_ALL_DRAWING' && event.data !== 'ARQUETA') {
        if (this.isDrawing) {
          this.isDrawing = false;
          this.mapService.map.removeInteraction(this.drawInteraction);
        }
      }
    });

    // IMPORTANTE: Verifica que este nombre sea EXACTAMENTE el mismo que tienes en tu map.service.ts
    const tituloCapa = 'Arquetas y Pozos vector'; 
    const layer = this.mapService.getLayerByTitle(tituloCapa) as VectorLayer<VectorSource>;
    
    if (!layer) {
      console.error(`❌ ERROR CRÍTICO: No existe ninguna capa llamada "${tituloCapa}" en map.service.ts`);
      return;
    }

    this.drawInteraction = new Draw({
      source: layer.getSource()!,
      type: 'Point' // Arquetas es un Punto
    });

    this.drawInteraction.on('drawend', (event) => {
      const format = new WKT();
      const geomWkt = format.writeGeometry(event.feature.getGeometry()!);
      this.toggleDraw(); 
      
      // IMPORTANTE: Verifica que '/arquetas-pozos' sea la ruta correcta a tu formulario en app.routes.ts
      this.router.navigate(['/arquetas-pozos'], { queryParams: { geom: geomWkt } });
    });
  }

  toggleDraw() {
    if (!this.authService.isAuthenticated) return;

    this.isDrawing = !this.isDrawing;
    if (this.isDrawing) {
      // Avisa a los demás que voy a empezar a dibujar
      this.eventService.emitEvent(new EventModel('STOP_ALL_DRAWING', 'ARQUETA'));
      
      this.mapService.disableMapInteractions(); 
      this.mapService.map.addInteraction(this.drawInteraction);
    } else {
      this.mapService.map.removeInteraction(this.drawInteraction);
    }
  }

  ngOnDestroy() {
    if (this.drawInteraction) {
      this.mapService.map.removeInteraction(this.drawInteraction);
    }
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
  }  
}