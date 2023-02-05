import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-gradient-hero-section',
  templateUrl: './gradient-hero-section.component.html',
  styleUrls: ['./gradient-hero-section.component.scss']
})
export class GradientHeroSectionComponent {
  @Input() title: string = "";
  @Input() subtitle: string = "";
  @Input() gradientFrom: string = "primary";
  @Input() gradientTo: string = "light";
  @Input() textColour: string = "dark";
}
