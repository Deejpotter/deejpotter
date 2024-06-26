import {Injectable} from "@angular/core";
import {RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly titleService: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.titleService.setTitle(`${title} | Deej Potter`);
    }
  }
}
