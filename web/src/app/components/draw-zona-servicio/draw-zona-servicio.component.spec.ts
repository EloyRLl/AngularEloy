import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawZonaServicioComponent } from './draw-zona-servicio.component';

describe('DrawZonaServicioComponent', () => {
  let component: DrawZonaServicioComponent;
  let fixture: ComponentFixture<DrawZonaServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawZonaServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawZonaServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
