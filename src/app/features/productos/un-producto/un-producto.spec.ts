import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnProducto } from './un-producto';

describe('UnProducto', () => {
  let component: UnProducto;
  let fixture: ComponentFixture<UnProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnProducto],
    }).compileComponents();

    fixture = TestBed.createComponent(UnProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
