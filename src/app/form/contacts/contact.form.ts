import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SelectOption } from '@app/custom-types/shared.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'contact-form',
  templateUrl: './contact.form.html',
  styleUrl: 'contact.form.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  protected readonly value = signal('');
  salutations: SelectOption[] = [
    { value: 'none', label: 'None' },
    { value: 'mr', label: 'Mr.' },
    { value: 'mrs', label: 'Mrs.' },
    { value: 'dr', label: 'Dr.' },
    { value: 'prof', label: 'Prof.' },
  ];
  leadSource: string[] = [
    'Existing Customer',
    'Partner',
    'Conference',
    'Website',
    'Word of mouth',
    'Other',
  ];
  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
