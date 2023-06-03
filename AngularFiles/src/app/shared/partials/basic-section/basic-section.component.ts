import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-basic-section',
  templateUrl: './basic-section.component.html',
  styleUrls: ['./basic-section.component.scss']
})
export class BasicSectionComponent {
  @Input() heading: string = "";
  @Input() paragraph: string = "";
  @Input() backgroundColour: string = "";
  @Input() textColour: string = "";
}
