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
          provide: 'user',
          useValue: {
            action: this.data.metadata.action,
            selectedUser: this.data.metadata.selectedUser,
            userList: this.data.metadata.userList,
          },
        },
        {
          provide: 'listUser',
          useValue: {
            action: 'create',
            userList: this.data.metadata.userList,
          },
        },
      ],
      parent: this.parentInjector,
    });
  }
}
