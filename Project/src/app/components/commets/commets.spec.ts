import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commets } from './commets';

describe('Commets', () => {
  let component: Commets;
  let fixture: ComponentFixture<Commets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
