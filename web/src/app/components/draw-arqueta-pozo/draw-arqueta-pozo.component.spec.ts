import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawArquetaPozoComponent } from './draw-arqueta-pozo.component';

describe('DrawArquetaPozoComponent', () => {
  let component: DrawArquetaPozoComponent;
  let fixture: ComponentFixture<DrawArquetaPozoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawArquetaPozoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawArquetaPozoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
