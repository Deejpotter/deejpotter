import {Injectable, NgModule} from '@angular/core';
import {RouterModule, RouterStateSnapshot, Routes, TitleStrategy} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {AboutPageComponent} from "./pages/about/about-page.component";
import {ContactPageComponent} from "./pages/contact/contact-page.component";
import {TermsComponent} from "./pages/terms/terms.component";
import {PrivacyComponent} from "./pages/privacy/privacy.component";
import {Title} from "@angular/platform-browser";
import {ProjectsComponent} from "./pages/projects/projects.component";
import {AppsComponent} from "./pages/projects/apps/apps.component";
import {WebsitesComponent} from "./pages/projects/websites/websites.component";
import {GamesComponent} from "./pages/projects/games/games.component";

const routes: Routes = [
  {path: 'about', component: AboutPageComponent, title: "About me"},
  {path: 'contact', component: ContactPageComponent, title: "Contact me"},
  {path: 'terms', component: TermsComponent, title: "Terms and conditions"},
  {path: 'privacy', component: PrivacyComponent, title: "Privacy policy"},
  {path: 'projects/apps', component: AppsComponent, title: "My apps"},
  {path: 'projects/websites', component: WebsitesComponent, title: "My websites"},
  {path: 'projects/games', component: GamesComponent, title: "My games"},
  {path: 'projects', component: ProjectsComponent, title: "My projects"},
  {path: 'projects/**', redirectTo: 'projects', pathMatch: 'full', title: "Missing Project"},
  {path: '', component: HomeComponent, pathMatch: "full", title: "Home"},
  {path: '**', redirectTo: '', pathMatch: 'full', title: "Missing page"}
];

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${title} | Deej Potter`);
    }
  }
}
@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
  providers: [
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy
    }
  ]
})
export class AppRoutingModule {
}

