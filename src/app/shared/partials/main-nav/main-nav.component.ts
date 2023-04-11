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
  isFunDropdownOpen = false;
  isWebsitesDropdownOpen = false;
  isGamesDropdownOpen: boolean = false;

  toggleNavMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this.isFunDropdownOpen = false;
    this.isWebsitesDropdownOpen = false;
  }

  closeNavMenu(): void {
    this.isMenuCollapsed = true;
    this.isFunDropdownOpen = false;
    this.isGamesDropdownOpen = false;
    this.isWebsitesDropdownOpen = false;
  }

  toggleFunDropdown(): void {
    this.isFunDropdownOpen = !this.isFunDropdownOpen;
    this.isWebsitesDropdownOpen = false;
    this.isGamesDropdownOpen = false;
  }

  toggleGamesDropdown(): void {
    this.isGamesDropdownOpen = !this.isGamesDropdownOpen;
    this.isFunDropdownOpen = false;
    this.isWebsitesDropdownOpen = false;
  }

  toggleWebsitesDropdown(): void {
    this.isWebsitesDropdownOpen = !this.isWebsitesDropdownOpen;
    this.isFunDropdownOpen = false;
    this.isFunDropdownOpen = false;
  }

}
