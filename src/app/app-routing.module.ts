import {NgModule} from '@angular/core';
import {RouterModule, Routes, TitleStrategy} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {AboutPageComponent} from "./pages/about/about-page.component";
import {ContactPageComponent} from "./pages/contact/contact-page.component";
import {TermsComponent} from "./pages/terms/terms.component";
import {PrivacyComponent} from "./pages/privacy/privacy.component";
import {WebsitesComponent} from "./pages/websites/websites.component";
import {GamesComponent} from "./pages/games/games.component";
import {TemplatePageTitleStrategy} from "./shared/services/template-page-title-strategy";
import {TodoListComponent} from "./pages/fun/todo-list/todo-list.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {FunComponent} from "./pages/fun/fun.component";
import {BaseGameComponent} from "./pages/games/base-game/base-game.component";

const routes: Routes = [
  {path: 'about', component: AboutPageComponent, title: "About me", data: {animation: 'about'}},
  {path: 'contact', component: ContactPageComponent, title: "Contact me", data: {animation: 'contact'}},
  {path: 'terms', component: TermsComponent, title: "Terms and conditions", data: {animation: 'terms'}},
  {path: 'privacy', component: PrivacyComponent, title: "Privacy policy", data: {animation: 'privacy'}},
  {path: 'fun/todo', component: TodoListComponent, title: "Todo list", data: {animation: 'todo'}, canActivate: [AuthGuard],},
  {path: 'fun', component: FunComponent, title: "Fun projects", data: {animation: 'fun'}},
  {path: 'fun/**', redirectTo: 'fun', pathMatch: 'full', title: "Missing Project", data: {animation: 'missingProject'}},
  {path: 'websites', component: WebsitesComponent, title: "My websites", data: {animation: 'websites'}},
  {path: 'websites/**', redirectTo: 'websites', pathMatch: 'full', title: "Missing Website", data: {animation: 'missingProject'}},
  {path: 'games/basegame', component: BaseGameComponent, title: "Base Game", data: {animation: 'mindscapes'}},
  {path: 'games', component: GamesComponent, title: "My games", data: {animation: 'games'}},
  {path: 'games/**', redirectTo: 'fun', pathMatch: 'full', title: "Missing Game", data: {animation: 'missingProject'}},
  {path: '', component: HomeComponent, pathMatch: "full", title: "Home", data: {animation: 'home'}},
  {path: '**', redirectTo: '', pathMatch: 'full', title: "Missing page", data: {animation: 'missing'}}
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
