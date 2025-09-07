import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'header-component',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
  switchLangEvent(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.switchLang(value);
  }
}
