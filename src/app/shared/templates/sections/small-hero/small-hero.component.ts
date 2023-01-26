import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-small-hero',
  templateUrl: './small-hero.component.html',
  styleUrls: ['./small-hero.component.scss']
})
export class SmallHeroComponent {
  @Input() title: string = "temp title";
  @Input() subTitle: string = "temp sub";

}
