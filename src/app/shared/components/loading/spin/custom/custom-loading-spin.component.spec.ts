import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLoadingSpinComponent } from './custom-loading-spin.component';

describe('CustomLoadingSpinComponent', () => {
  let component: CustomLoadingSpinComponent;
  let fixture: ComponentFixture<CustomLoadingSpinComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomLoadingSpinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLoadingSpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
