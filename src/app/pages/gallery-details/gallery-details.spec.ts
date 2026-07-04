import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryDetails } from './gallery-details';

describe('GalleryDetails', () => {
  let component: GalleryDetails;
  let fixture: ComponentFixture<GalleryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
