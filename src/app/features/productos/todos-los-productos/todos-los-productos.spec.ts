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


/*
<div class="contenedor">
  @for (item of categorias; track $index) {
  <div class="Repetible">
    <h2>{{ item }}</h2>
  </div>
  } @empty {
  <h2>No hay categorias</h2>
  }
</div>

<div class="contenedor">
  @for (item of marcas; track $index) {
  <div class="Repetible">
    <h2>{{ item }}</h2>
  </div>
  } @empty {
  <h2>No hay marcas</h2>
  }
</div>
*/