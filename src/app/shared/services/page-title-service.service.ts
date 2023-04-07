import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private readonly defaultTitle = 'Deej Potter';

  constructor(private readonly titleService: Title) {
  }

  public setTitle(title: string) {
    this.titleService.setTitle(title ? `${title} | ${this.defaultTitle}` : this.defaultTitle);
  }

  getTitle() {
    return this.titleService.getTitle();
  }

}
