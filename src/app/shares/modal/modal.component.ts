import { CommonModule } from '@angular/common';
import { Inject, Injector, Type, Component } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserFormData } from '@app/interfaces/user-form-data.interface';

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
      metadata: UserFormData;
    },
    private parentInjector: Injector,
  ) {
    this.injector = Injector.create({
      providers: [
        {
          provide: 'data',
          useValue: {
            action: this.data.metadata.action,
            dataSelected: this.data.metadata.dataSelected,
            dataList: this.data.metadata.dataList,
          },
        },
        {
          provide: 'listData',
          useValue: {
            action: 'create',
            dataList: this.data.metadata.dataList,
          },
        },
      ],
      parent: this.parentInjector,
    });
  }
}
