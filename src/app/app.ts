import { Component } from '@angular/core';
import { LayoutComponent } from '@layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  templateUrl: './app.html',
})
export class App {
  protected title = 'crm-ui';
}
