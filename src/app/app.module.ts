import { NgModule } from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { AboutPageComponent } from './pages/about/about-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MainNavComponent } from './shared/partials/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ContactPageComponent } from './pages/contact/contact-page.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainFooterComponent } from './shared/partials/main-footer/main-footer.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AppsComponent } from './pages/projects/apps/apps.component';
import { GamesComponent } from './pages/projects/games/games.component';
import { WebsitesComponent } from './pages/projects/websites/websites.component';
import { SmallHeroComponent } from './shared/templates/sections/small-hero/small-hero.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutPageComponent,
    MainNavComponent,
    ContactPageComponent,
    TermsComponent,
    PrivacyComponent,
    MainFooterComponent,
    ProjectsComponent,
    AppsComponent,
    GamesComponent,
    WebsitesComponent,
    SmallHeroComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    LayoutModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
