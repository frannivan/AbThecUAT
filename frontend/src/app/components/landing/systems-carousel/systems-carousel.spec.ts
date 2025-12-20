import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemsCarousel } from './systems-carousel';

describe('SystemsCarousel', () => {
  let component: SystemsCarousel;
  let fixture: ComponentFixture<SystemsCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemsCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemsCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
