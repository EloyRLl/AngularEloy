import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaServicioFormComponent } from './zona-servicio-form.component';

describe('ZonaServicioFormComponent', () => {
  let component: ZonaServicioFormComponent;
  let fixture: ComponentFixture<ZonaServicioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonaServicioFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonaServicioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
