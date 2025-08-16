import { CommonModule } from '@angular/common';
import {
  Inject,
  Injector,
  Type,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormData } from '@app/interfaces/user-form-data.interface';
import { ButtonComponent } from '../button/button.component';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { ErrorComponent } from '../error/error.component';
import { FilterComponent } from '../filter/filter.component';
import { SelectOptioncomponent } from '../select-option/select-option.component';

@Component({
  standalone: true,
  imports: [MatDialogModule, CommonModule, ButtonComponent],
  selector: 'app-modal-dialog',
  templateUrl: './modal.component.html',
})
export class ModalDiaLogComponent {
  @ViewChild('dynamicComponentHost', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  childInstance: any;
  injector: Injector;
  isHidden: Boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalDiaLogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: Type<unknown>;
      title: string;
      data: FormData;
    },
    private parentInjector: Injector,
  ) {
    this.injector = Injector.create({
      providers: [
        {
          provide: 'data',
          useValue: {
            action: this.data.data?.action,
            dataSelected: this.data.data?.dataSelected,
            dataList: this.data.data?.dataList,
            message: this.data.data?.message,
            from: this.data.data?.from,
          },
        },
      ],
      parent: this.parentInjector,
    });
  }
  private isHiddenComponent(comp: any): boolean {
    const hiddenComponents = [
      SelectOptioncomponent,
      ErrorComponent,
      FilterComponent,
      ConfirmActionComponent,
    ];
    return hiddenComponents.some((c) => comp instanceof c);
  }

  ngOnInit() {
    const compRef = this.container.createComponent(this.data.component, {
      injector: this.injector,
    });
    this.childInstance = compRef.instance;
    this.isHidden = this.isHiddenComponent(this.childInstance);
  }

  handleClickSubmit() {
    if (
      this.childInstance &&
      typeof this.childInstance.onSubmit === 'function'
    ) {
      this.childInstance.onSubmit();
    }
  }

  onClose() {
    this.dialogRef.close({
      isSubmit: false,
    });
  }
}
