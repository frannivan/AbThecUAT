import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyAbtech } from './why-abtech';

describe('WhyAbtech', () => {
  let component: WhyAbtech;
  let fixture: ComponentFixture<WhyAbtech>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyAbtech]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyAbtech);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
