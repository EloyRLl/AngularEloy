import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../services/map.service';
import { Router } from '@angular/router';
import Draw from 'ol/interaction/Draw';
import WKT from 'ol/format/WKT';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'app-draw-tuberia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button *ngIf="isUserLoggedIn" (click)="toggleDraw()" [ngClass]="{'active': isDrawing}" style="margin-bottom: 5px; cursor: pointer;">
      {{ isDrawing ? '🛑 Parar Tubería' : '〰️ Dibujar Tubería' }}
    </button>
  `,
  styles: [`
    .active { background-color: lightblue; font-weight: bold; }
    button { padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc; }
  `]
})
export class DrawTuberiaComponent implements OnInit, OnDestroy {
  drawInteraction!: Draw;
  isDrawing: boolean = false;
  
  // Variable de control
  isUserLoggedIn: boolean = false; 

  constructor(private mapService: MapService, private router: Router) {}

  ngOnInit() {
    // Comprobación silenciosa de la sesión
    const token = localStorage.getItem('token');
    this.isUserLoggedIn = !!token && token !== 'undefined' && token !== 'null';

    const layer = this.mapService.getLayerByTitle('Tuberías vector') as VectorLayer<VectorSource>;
    if (!layer) return;

    this.drawInteraction = new Draw({
      source: layer.getSource()!,
      type: 'LineString' 
    });

    this.drawInteraction.on('drawend', (event) => {
      const format = new WKT();
      const geomWkt = format.writeGeometry(event.feature.getGeometry()!);
      this.toggleDraw(); 
      this.router.navigate(['/tuberias'], { queryParams: { geom: geomWkt } });
    });
  }

  toggleDraw() {
    // Cortafuegos silencioso: si logran forzar la aparición del botón, no hace nada
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