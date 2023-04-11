import {Component} from '@angular/core';
import {dropdownAnimation} from '../../utils/animations';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  animations: [dropdownAnimation()],
})
export class MainNavComponent {
  isMenuCollapsed = true;
  isFunDropdownOpen = false;
  isWebsitesDropdownOpen = false;
  isGamesDropdownOpen = false;

  toggleNavMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  closeNavMenu(): void {
    this.isMenuCollapsed = true;
  }

  showDropdown(dropdown: string): void {
    this.isFunDropdownOpen = dropdown === 'fun';
    this.isWebsitesDropdownOpen = dropdown === 'websites';
    this.isGamesDropdownOpen = dropdown === 'games';
  }

  hideDropdowns(): void {
    this.isFunDropdownOpen = false;
    this.isWebsitesDropdownOpen = false;
    this.isGamesDropdownOpen = false;
  }
}
