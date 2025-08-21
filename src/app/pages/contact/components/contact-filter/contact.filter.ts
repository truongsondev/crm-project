import {
  Component,
  ChangeDetectionStrategy,
  signal,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { LEAD_SOURCE } from '@app/constants/shared.constant';
import { From } from '@app/custom-types/shared.type';
import { ContactService } from '@app/services/contact.service';
import { ButtonComponent } from '@app/shared-components/button/button.component';

import { combineLatest, map, Observable, startWith, take } from 'rxjs';
import { Contact } from '@app/interfaces/contact.interface';

@Component({
  selector: 'filter-component',
  templateUrl: './contact.filter.html',
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
export class ContactFilterComponent {
  contacts$!: Observable<Contact[]>;
  filteredContacts$!: Observable<Contact[]>;

  filterFormContact = new FormGroup({
    leadSource: new FormControl<String>(''),
    assignedTo: new FormControl<String>(''),
    createStartDate: new FormControl<Date | null>(null),
    createEndDate: new FormControl<Date | null>(null),
    updateStartDate: new FormControl<Date | null>(null),
    updateEndDate: new FormControl<Date | null>(null),
  });

  leadSource: string[] = LEAD_SOURCE;
  assignedTo: string[] = [];

  protected readonly value = signal('');

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }
  constructor(
    private dialogRef: MatDialogRef<ContactFilterComponent>,
    private contactService: ContactService,
    @Inject('data') public fromData: From,
  ) {}

  ngOnInit() {
    this.contacts$ = this.contactService.getListContact().pipe(
      map((res) => {
        return res.contacts;
      }),
    );
    this.contacts$.subscribe((res) => {
      const names = res.map((item) => item.assigned_to.name);
      this.assignedTo = [...new Set(names)];
    });
    this.combineValue();
  }

  combineValue() {
    this.filteredContacts$ = combineLatest([
      this.contacts$,
      this.filterFormContact.valueChanges.pipe(
        startWith(this.filterFormContact.value),
      ),
    ]).pipe(map(([users, filter]) => this.applyFilter(users, filter)));
  }

  private applyFilter(users: Contact[], filter: any): Contact[] {
    return users.filter((item) => {
      let match = true;
      console.log(item);
      console.log('filter:::', filter);
      if (filter.leadSource) {
        match = match && item.lead_source === filter.leadSource;
      }

      if (filter.assignedTo) {
        match = match && item.assigned_to.name === filter.assignedTo;
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
    this.filteredContacts$.pipe(take(1)).subscribe((filtered) => {
      this.dialogRef.close({
        filtered: this.filterFormContact.value,
        contacts: filtered,
      });
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
