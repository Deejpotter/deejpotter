import {NgModule} from '@angular/core';
import {RouterModule, Routes, TitleStrategy} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {AboutPageComponent} from "./pages/about/about-page.component";
import {ContactPageComponent} from "./pages/contact/contact-page.component";
import {TermsComponent} from "./pages/terms/terms.component";
import {PrivacyComponent} from "./pages/privacy/privacy.component";
import {ProjectsComponent} from "./pages/projects/projects.component";
import {AppsComponent} from "./pages/projects/apps/apps.component";
import {WebsitesComponent} from "./pages/projects/websites/websites.component";
import {GamesComponent} from "./pages/projects/games/games.component";
import {TemplatePageTitleStrategy} from "./shared/services/template-page-title-strategy";

const routes: Routes = [
  {path: 'about', component: AboutPageComponent, title: "About me"},
  {path: 'contact', component: ContactPageComponent, title: "Contact me"},
  {path: 'terms', component: TermsComponent, title: "Terms and conditions"},
  {path: 'privacy', component: PrivacyComponent, title: "Privacy policy"},
  {path: 'projects/apps', component: AppsComponent, title: "My apps | Projects"},
  {path: 'projects/websites', component: WebsitesComponent, title: "My websites | Projects"},
  {path: 'projects/games', component: GamesComponent, title: "My games | Projects"},
  {path: 'projects', component: ProjectsComponent, title: "My projects"},
  {path: 'projects/**', redirectTo: 'projects', pathMatch: 'full', title: "Missing Project | Projects"},
  {path: '', component: HomeComponent, pathMatch: "full", title: "Home"},
  {path: '**', redirectTo: '', pathMatch: 'full', title: "Missing page"}
];

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
