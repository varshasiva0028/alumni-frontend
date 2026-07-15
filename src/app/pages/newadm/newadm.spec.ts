import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Newadm } from './newadm';

describe('Newadm', () => {
  let component: Newadm;
  let fixture: ComponentFixture<Newadm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Newadm],
    }).compileComponents();

    fixture = TestBed.createComponent(Newadm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
