import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuberiaFormComponent } from './tuberia-form.component';

describe('TuberiaFormComponent', () => {
  let component: TuberiaFormComponent;
  let fixture: ComponentFixture<TuberiaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuberiaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuberiaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
