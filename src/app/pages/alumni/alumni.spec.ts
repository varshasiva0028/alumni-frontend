import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alumni } from './alumni';

describe('Alumni', () => {
  let component: Alumni;
  let fixture: ComponentFixture<Alumni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alumni],
    }).compileComponents();

    fixture = TestBed.createComponent(Alumni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
