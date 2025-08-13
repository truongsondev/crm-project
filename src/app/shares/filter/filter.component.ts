import {
  Component,
  ChangeDetectionStrategy,
  signal,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '@app/interfaces/user.interface';
import { UserService } from '@app/services/user.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { LEAD_SOURCE, ROLES } from '@app/constants/shared.constant';
import { From } from '@app/custom-types/shared.type';
import { ContactService } from '@app/services/contact.service';

enum OpenedFromEnum {
  USER_MANAGEMENT = 'user-management',
  CONTACT = 'contact',
  SALE_ORDER = 'sale-order',
}

@Component({
  selector: 'filter-component',
  templateUrl: './filter.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FilterComponent {
  openedFrom: string = '';
  leadSource: string[] = LEAD_SOURCE;
  assignedTo: string[] = [];
  readonly createTime = new FormGroup({
    createStartDate: new FormControl<Date | null>(null),
    createEndDate: new FormControl<Date | null>(null),
  });
  readonly updateTime = new FormGroup({
    updateStartDate: new FormControl<Date | null>(null),
    updateEndDate: new FormControl<Date | null>(null),
  });

  displayRole = ROLES;
  protected readonly value = signal('');

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }
  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<FilterComponent>,
    private contactService: ContactService,
    @Inject('data') public fromData: From,
  ) {}
  employees: User[] = [];
  selectedRole = '';
  selectedLeadSource = '';
  selectedAssignTo = '';
  ngOnInit(): void {
    this.openedFrom = this.fromData.from;
    if (this.openedFrom === OpenedFromEnum.CONTACT) {
      this.contactService.getListContact().subscribe((res) => {
        const names = res.contacts.map((item) => item.assigned_to.name);
        this.assignedTo = [...new Set(names)];
      });
    }
  }

  listData: any[] = [];
  filterList(list: any[]): any[] {
    return list.filter((item) => {
      let match = true;

      if (this.openedFrom === OpenedFromEnum.USER_MANAGEMENT) {
        if (this.selectedRole) {
          match = match && item.role === this.selectedRole;
        }
      } else if (this.openedFrom === OpenedFromEnum.CONTACT) {
        if (this.selectedLeadSource) {
          match = match && item.lead_source === this.selectedLeadSource;
        }
        if (this.selectedAssignTo) {
          match = match && item.assigned_to.name === this.selectedAssignTo;
        }
      }

      const createdStart = this.createTime.get('createStartDate')?.value;
      const createdEnd = this.createTime.get('createEndDate')?.value;

      if (createdStart && createdEnd) {
        const createdTime = new Date(item.created_on);
        match =
          match && createdTime >= createdStart && createdTime <= createdEnd;
      }

      const updatedStart = this.updateTime.get('updateStartDate')?.value;
      const updatedEnd = this.updateTime.get('updateEndDate')?.value;
      if (updatedStart && updatedEnd) {
        const updatedTime = new Date(item.updated_on);
        match =
          match && updatedTime >= updatedStart && updatedTime <= updatedEnd;
      }
      return match;
    });
  }

  onSubmit() {
    if (this.openedFrom === OpenedFromEnum.USER_MANAGEMENT) {
      this.userService.getListUser().subscribe((res) => {
        const { users } = res;
        this.listData = users;
        const filtered = this.filterList(users);
        this.dialogRef.close({
          role: this.selectedRole,
          createdRange: this.createTime.value,
          updatedRange: this.updateTime.value,
          employees: filtered,
        });
      });
    } else if (this.openedFrom === OpenedFromEnum.CONTACT) {
      this.contactService.getListContact().subscribe((res) => {
        const { contacts } = res;
        this.listData = contacts;
        const filtered = this.filterList(contacts);
        this.dialogRef.close({
          leadSource: this.selectedLeadSource,
          assigndTo: this.selectedAssignTo,
          createdRange: this.createTime.value,
          updatedRange: this.updateTime.value,
          contacts: filtered,
        });
      });
    }
  }

  onCancel() {
    this.userService.getListUser().subscribe((users) => {
      this.dialogRef.close({
        employees: users,
      });
    });

    this.userService.getListUser();
  }

  getUserByRole(role: string) {
    this.selectedRole = role;
  }

  getUserByLeadSource(item: string) {
    this.selectedLeadSource = item;
  }

  getUserByAssignedTo(item: string) {
    this.selectedAssignTo = item;
  }
}
