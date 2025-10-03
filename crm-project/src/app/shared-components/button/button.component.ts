import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'button-component',
  templateUrl: './button.component.html',
  imports: [MatIconModule, CommonModule, MatButtonModule],
})
export class ButtonComponent {
  @Input() className: string = '';
  @Input() textBt: string = '';
  @Input() textIcon: string = '';
}
