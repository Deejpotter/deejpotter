import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.setTitle("Deej Potter")
  }

  public setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }

  public getTitle(): string {
    return this.titleService.getTitle();
  }
}
