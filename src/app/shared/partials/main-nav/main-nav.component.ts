import {Component} from '@angular/core';
import {dropdownAnimation} from "../../utils/animations";

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  animations: [dropdownAnimation()]
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
