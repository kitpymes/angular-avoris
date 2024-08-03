import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLoadingBarComponent } from './custom-loading-bar.component';

describe('CustomLoadingBarComponent', () => {
  let component: CustomLoadingBarComponent;
  let fixture: ComponentFixture<CustomLoadingBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomLoadingBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLoadingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
