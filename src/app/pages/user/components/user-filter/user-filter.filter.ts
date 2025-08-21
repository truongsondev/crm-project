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

import { From } from '@app/custom-types/shared.type';

import { ButtonComponent } from '@app/shared-components/button/button.component';
import { ROLES } from '@app/constants/shared.constant';
import { combineLatest, map, Observable, startWith, take } from 'rxjs';

@Component({
  selector: 'filter-component',
  templateUrl: './user-filter.filter.html',
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
    ButtonComponent,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserFilterComponent {
  displayRole = ROLES;
  users$!: Observable<User[]>;
  filteredUsers$!: Observable<User[]>;
  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFilterComponent>,
    @Inject('data') public fromData: From,
  ) {}

  filterFormUser = new FormGroup({
    role: new FormControl<string>(''),
    createStartDate: new FormControl<Date | null>(null),
    createEndDate: new FormControl<Date | null>(null),
    updateStartDate: new FormControl<Date | null>(null),
    updateEndDate: new FormControl<Date | null>(null),
  });

  protected readonly value = signal('');

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }

  ngOnInit(): void {
    this.users$ = this.userService.getListUser().pipe(map((res) => res.users));
    console.log('users in init:::', this.users$);
    this.combineValue();
  }

  combineValue() {
    this.filteredUsers$ = combineLatest([
      this.users$,
      this.filterFormUser.valueChanges.pipe(
        startWith(this.filterFormUser.value),
      ),
    ]).pipe(map(([users, filter]) => this.applyFilter(users, filter)));
  }

  private applyFilter(users: User[], filter: any): User[] {
    return users.filter((item) => {
      let match = true;
      console.log(item);
      console.log('filter:::', filter);
      if (filter.role) {
        match = match && item.role === filter.role;
      }

      if (filter.createStartDate && filter.createEndDate) {
        const createdTime = new Date(item.created_on);
        match =
          match &&
          createdTime >= filter.createStartDate &&
          createdTime <= filter.createEndDate;
      }

      if (filter.updateStartDate && filter.updateEndDate) {
        const updatedTime = new Date(item.updated_on);
        match =
          match &&
          updatedTime >= filter.updateStartDate &&
          updatedTime <= filter.updateEndDate;
      }

      return match;
    });
  }

  onSubmit() {
    this.combineValue();
    this.filteredUsers$.pipe(take(1)).subscribe((filtered) => {
      this.dialogRef.close({
        filters: this.filterFormUser.value,
        users: filtered,
      });
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
