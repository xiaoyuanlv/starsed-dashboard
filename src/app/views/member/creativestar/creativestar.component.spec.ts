import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativestarComponent } from './creativestar.component';

describe('CreativestarComponent', () => {
  let component: CreativestarComponent;
  let fixture: ComponentFixture<CreativestarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreativestarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativestarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
