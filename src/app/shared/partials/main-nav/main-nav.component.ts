import {Component} from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})

export class MainNavComponent {
  isMenuCollapsed: boolean = true;

  public ToggleNavMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  public OpenNavMenu() {
    this.isMenuCollapsed = false;
  }

  public CloseNavMenu() {
    this.isMenuCollapsed = true;
  }
}
