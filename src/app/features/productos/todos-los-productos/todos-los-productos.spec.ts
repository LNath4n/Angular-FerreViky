import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosLosProductos } from './todos-los-productos';

describe('TodosLosProductos', () => {
  let component: TodosLosProductos;
  let fixture: ComponentFixture<TodosLosProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosLosProductos],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosLosProductos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
