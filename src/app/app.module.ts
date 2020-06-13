import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VerificationModule } from './verification/verification.module';
import { DeviceDetectorModule, DeviceDetectorService } from 'ngx-device-detector';
import { HttpClientModule } from '@angular/common/http';
import { TwitchAuthCallbackModule } from './callback/callback.module';
import { SpinnerModule } from './components/spinner/spinner.module';
import { HomeModule } from './home/home.module';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    VerificationModule,
    TwitchAuthCallbackModule,
    HomeModule,
    SpinnerModule,
    DeviceDetectorModule.forRoot(),
    HttpClientModule,

  ],
  exports: [SpinnerModule],
  // providers: [],
  providers: [DeviceDetectorService, 
    //HashLocationStrategy
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
