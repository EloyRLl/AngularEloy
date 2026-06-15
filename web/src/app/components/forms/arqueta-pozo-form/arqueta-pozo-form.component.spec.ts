import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArquetaPozoFormComponent } from './arqueta-pozo-form.component';

describe('ArquetaPozoFormComponent', () => {
  let component: ArquetaPozoFormComponent;
  let fixture: ComponentFixture<ArquetaPozoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArquetaPozoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArquetaPozoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
