import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../services/map.service';
import { Router } from '@angular/router';
import Draw from 'ol/interaction/Draw';
import WKT from 'ol/format/WKT';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'app-draw-zona-servicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button *ngIf="isUserLoggedIn" (click)="toggleDraw()" [ngClass]="{'active': isDrawing}" style="margin-bottom: 5px; cursor: pointer;">
      {{ isDrawing ? '🛑 Parar Zona' : '⬟ Dibujar Zona' }}
    </button>
  `,
  styles: [`
    .active { background-color: lightgreen; font-weight: bold; }
    button { padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc; }
  `]
})
export class DrawZonaServicioComponent implements OnInit, OnDestroy {
  drawInteraction!: Draw;
  isDrawing: boolean = false;
  isUserLoggedIn: boolean = false; 

  constructor(private mapService: MapService, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.isUserLoggedIn = !!token && token !== 'undefined' && token !== 'null';

    // ⚠️ ATENCIÓN AQUÍ: Si no te funciona, el error está en este texto
    const tituloCapa = 'Zonas Servicio vector'; 
    const layer = this.mapService.getLayerByTitle(tituloCapa) as VectorLayer<VectorSource>;
    
    if (!layer) {
      console.error(`❌ ERROR CRÍTICO: No existe ninguna capa llamada "${tituloCapa}" en map.service.ts`);
      return;
    }

    this.drawInteraction = new Draw({
      source: layer.getSource()!,
      type: 'Polygon' // Zonas son polígonos
    });

    this.drawInteraction.on('drawend', (event) => {
      const format = new WKT();
      const geomWkt = format.writeGeometry(event.feature.getGeometry()!);
      this.toggleDraw(); 
      this.router.navigate(['/zonas-servicio'], { queryParams: { geom: geomWkt } });
    });
  }

  toggleDraw() {
    if (!this.isUserLoggedIn) return;

    this.isDrawing = !this.isDrawing;
    if (this.isDrawing) {
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
  }
}