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
import { FormData } from '@app/interfaces/form-data.interface';
import { ContactFilterComponent } from '@app/pages/contact/components/contact-filter/contact.component';
import { SalesOrderFilterComponent } from '@app/pages/salesOrder/components/sales-order-filter/sales-order.component';
import { UserFilterComponent } from '@app/pages/user/components/user-filter/user-filter.component';
import { ButtonComponent } from '../button/button.component';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { ErrorComponent } from '../error/error.component';
import { SelectOptionComponent } from '../select-option/select-option.component';

@Component({
  standalone: true,
  imports: [MatDialogModule, CommonModule, ButtonComponent],
  selector: 'app-modal',
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
            selectedRow: this.data.data?.selectedRow,
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
      SelectOptionComponent,
      ErrorComponent,
      ConfirmActionComponent,
      UserFilterComponent,
      SalesOrderFilterComponent,
      ContactFilterComponent,
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
