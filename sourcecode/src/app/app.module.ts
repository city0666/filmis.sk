import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthModule} from '../common/auth/auth.module';
import {CoreModule} from '../common/core/core.module';
import {RouterModule} from '@angular/router';
import {AccountSettingsModule} from '../common/account-settings/account-settings.module';
import {PagesModule} from '../common/core/pages/pages.module';
import {APP_CONFIG} from '../common/core/config/vebto-config';
import {MTDB_CONFIG} from './mtdb-config';
import {AppRoutingModule} from './app-routing.module';
import {SiteModule} from './site/site.module';
import {NgxsModule} from '@ngxs/store';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {AppState} from './state/app-state';
import {Bootstrapper} from '../common/core/bootstrapper.service';
import {AppBootstrapperService} from './app-bootstrapper.service';
import {environment} from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([], {scrollPositionRestoration: 'top'}),
        CoreModule.forRoot(),
        AuthModule,
        AccountSettingsModule,
        AppRoutingModule,
        SiteModule,
        PagesModule,

        NgxsModule.forRoot([AppState], {developmentMode: !environment.production}),
        NgxsRouterPluginModule.forRoot(),
    ],
    providers: [
        {
            provide: APP_CONFIG,
            useValue: MTDB_CONFIG,
            multi: true,
        },
        {
            provide: Bootstrapper,
            useClass: AppBootstrapperService,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
