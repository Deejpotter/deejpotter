import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-shadow-hero-section',
  templateUrl: './shadow-hero-section.component.html',
  styleUrls: ['./shadow-hero-section.component.scss']
})
export class ShadowHeroSectionComponent {
  @Input() title: string = "";
  @Input() subtitle: string = "";
  @Input() backgroundColour: string = "info";
  @Input() textColour: string = "dark";
}
