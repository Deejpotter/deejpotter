import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './pages/home/home.component';
import {AboutPageComponent} from './pages/about/about-page.component';
import {MainNavComponent} from './shared/partials/main-nav/main-nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import {ContactPageComponent} from './pages/contact/contact-page.component';
import {TermsComponent} from './pages/terms/terms.component';
import {PrivacyComponent} from './pages/privacy/privacy.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MainFooterComponent} from './shared/partials/main-footer/main-footer.component';
import {ProjectsComponent} from './pages/projects/projects.component';
import {AppsComponent} from './pages/projects/apps/apps.component';
import {GamesComponent} from './pages/projects/games/games.component';
import {WebsitesComponent} from './pages/projects/websites/websites.component';
import {FunComponent} from './pages/projects/fun/fun.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BasicSectionComponent} from './shared/templates/sections/basic-section/basic-section.component';
import {
  ShadowHeroSectionComponent
} from './shared/templates/sections/shadow-hero-section/shadow-hero-section.component';
import {
  GradientHeroSectionComponent
} from './shared/templates/sections/gradient-hero-section/gradient-hero-section.component';
import {AuthInterceptor} from "./shared/interceptors/auth.interceptor";
import {AuthComponent} from './shared/partials/auth/auth.component';
import {ToastrModule} from "ngx-toastr";

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
    FunComponent,
    BasicSectionComponent,
    ShadowHeroSectionComponent,
    GradientHeroSectionComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
