import { Component, inject } from '@angular/core';
import { LucideCircleCheck, LucideCircleX, LucideTriangleAlert, LucideX } from '@lucide/angular';
import { AlertaService } from '@core/services/Modals/ModalsService';

@Component({
  selector: 'app-alerta-modal',
  imports: [LucideCircleCheck, LucideCircleX, LucideTriangleAlert, LucideX],
  templateUrl: './alerta-modal.html',
  styleUrl: './alerta-modal.css',
})
export class AlertaModal {
  private alertaService = inject(AlertaService);
  alertas = this.alertaService.alertas;

  cerrar(id: number) {
    this.alertaService.cerrar(id);
  }
}