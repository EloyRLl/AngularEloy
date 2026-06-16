import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawTuberiaComponent } from './draw-tuberia.component';

describe('DrawTuberiaComponent', () => {
  let component: DrawTuberiaComponent;
  let fixture: ComponentFixture<DrawTuberiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawTuberiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawTuberiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
