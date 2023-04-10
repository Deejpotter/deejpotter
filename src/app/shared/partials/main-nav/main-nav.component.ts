import {Component} from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  isMenuCollapsed = true;
  isProjectsDropdownOpen = false;
  isAppsDropdownOpen = false;

  toggleNavMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this.isProjectsDropdownOpen = false;
    this.isAppsDropdownOpen = false;
  }

  openNavMenu(): void {
    this.isMenuCollapsed = false;
  }

  closeNavMenu(): void {
    this.isMenuCollapsed = true;
    this.isProjectsDropdownOpen = false;
    this.isAppsDropdownOpen = false;
  }

  toggleProjectsDropdown(): void {
    this.isProjectsDropdownOpen = !this.isProjectsDropdownOpen;
    this.isAppsDropdownOpen = false;
  }

  toggleAppsDropdown(): void {
    this.isAppsDropdownOpen = !this.isAppsDropdownOpen;
    this.isProjectsDropdownOpen = false;
  }
}
