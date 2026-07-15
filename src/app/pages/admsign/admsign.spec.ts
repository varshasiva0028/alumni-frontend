import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admsign } from './admsign';

describe('Admsign', () => {
  let component: Admsign;
  let fixture: ComponentFixture<Admsign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admsign],
    }).compileComponents();

    fixture = TestBed.createComponent(Admsign);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
