import { Component, Inject } from '@angular/core';
import { Error } from '@app/custom-types/shared.type';
@Component({
  selector: 'error-component',
  templateUrl: 'error.component.html',
  standalone: true,
})
export class ErrorComponent {
  message!: string;

  constructor(@Inject('data') public data: Error) {}

  ngOnInit() {
    this.message = this.data.message;
  }
}
