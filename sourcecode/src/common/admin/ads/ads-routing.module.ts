import {Route} from '@angular/router';
import {DownloadComponent} from './download/download.component';
import {BannerComponent} from './banner/banner.component';
import {PopupsComponent} from './popups/popups.component';

export const vebtoAdsRoutes: Route[] = [
    {path: '', redirectTo: 'download', pathMatch: 'full'},
    {path: 'download', component: DownloadComponent, pathMatch: 'full'},
    {path: 'banners', component: BannerComponent},
    {path: 'popups', component: PopupsComponent}
];
