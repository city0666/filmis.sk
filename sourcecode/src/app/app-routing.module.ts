import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ContactComponent} from '../common/contact/contact.component';
import {HomepageComponent} from './site/homepage/homepage.component';
import {HomepageListsResolverService} from './site/homepage/homepage-lists-resolver.service';

const routes: Routes = [
    {path: '', component: HomepageComponent, resolve: {api: HomepageListsResolverService}, data: {name: 'homepage'}},
    {path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'},
    {path: 'billing', loadChildren: 'common/billing/billing.module#BillingModule'},
    {path: 'contact', component: ContactComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
