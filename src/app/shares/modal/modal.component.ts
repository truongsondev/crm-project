import { Component, Inject, Injector, Type } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { User } from '@app/interfaces/user.interface';
@Component({
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  selector: 'app-modal-dialog',
  templateUrl: './modal.component.html',
})
export class ModalDiaLogComponent {
  injector: Injector;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: Type<unknown>;
      title: string;
      metadata: {
        action: string;
        user: User;
      };
    },
    private parentInjector: Injector,
  ) {
    console.log('compoent:::', data.component);
    this.injector = Injector.create({
      providers: [{ provide: 'user', useValue: this.data.metadata }],
      parent: this.parentInjector,
    });
  }
}
