import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
// import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideHttpClient } from '@angular/common/http';
import { RxStompService } from './app/service/rx-stomp.service';
import { rxStompServiceFactory } from './app/service/rx-stomp-service-factory';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
    provideIonicAngular(),
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    // provideOAuthClient(),
    provideHttpClient()
  ],
});
