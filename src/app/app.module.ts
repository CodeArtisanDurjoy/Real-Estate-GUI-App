import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { FormsModule } from '@angular/forms';
import { ListingItemComponent } from './components/listing-item/listing-item.component';
import { LoginComponent } from './pages/login/login.component';
import { AddPropertyComponent } from './pages/add-property/add-property.component';
import { PropertyDetailsComponent } from './pages/property-details/property-details.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { ServicesCardComponent } from './components/services-card/services-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './components/alert/alert.component';
import { UpdatePropertyComponent } from './pages/update-property/update-property.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { SwiperDirective } from './directives/swiper.directive';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { register } from 'swiper/element/bundle';

import firebase from 'firebase/compat/app';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ListingItemComponent,
    LoginComponent,
    AddPropertyComponent,
    PropertyDetailsComponent,
    SignupComponent,
    ProfileComponent,
    SearchComponent,
    ServicesCardComponent,
    FooterComponent,
    AlertComponent,
    UpdatePropertyComponent,
    CarouselComponent,
    SwiperDirective,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
