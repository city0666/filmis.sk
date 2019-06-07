import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from '../../common/admin/admin.component';
import {AuthGuard} from '../../common/guards/auth-guard.service';
import {CheckPermissionsGuard} from '../../common/guards/check-permissions-guard.service';
import {SettingsComponent} from '../../common/admin/settings/settings.component';
import {SettingsResolve} from '../../common/admin/settings/settings-resolve.service';
import {vebtoSettingsRoutes} from '../../common/admin/settings/settings-routing.module';
import {TitlesPageComponent} from './titles-page/titles-page.component';
import {CrupdateTitleComponent} from './titles-page/crupdate-title/crupdate-title.component';
import {vebtoAdminRoutes} from '../../common/admin/base-admin-routing.module';
import {NewsPageComponent} from './news-page/news-page.component';
import {CrupdateArticleComponent} from './news-page/crupdate-article/crupdate-article.component';
import {ContentSettingsComponent} from './settings/content/content-settings.component';
import {PeoplePageComponent} from './people-page/people-page.component';
import {CrupdatePersonPageComponent} from './people-page/crupdate-person-page/crupdate-person-page.component';
import {VideosPageComponent} from './videos-page/videos-page.component';
import {ListsPageComponent} from './lists-page/lists-page.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard, CheckPermissionsGuard],
        canActivateChild: [AuthGuard, CheckPermissionsGuard],
        data: {permissions: ['admin.access']},
        children: [
            // videos
            {
                path: 'videos',
                component: VideosPageComponent,
                data: {permissions: ['videos.view']}
            },

            // lists
            {
                path: 'lists',
                component: ListsPageComponent,
                data: {permissions: ['lists.view']}
            },

            // news
            {
                path: 'news',
                component: NewsPageComponent,
                data: {permissions: ['news.view']}
            },
            {
                path: 'news/:id/edit',
                component: CrupdateArticleComponent,
                data: {permissions: ['news.update']}
            },
            {
                path: 'news/create',
                component: CrupdateArticleComponent,
                data: {permissions: ['news.create']}
            },

            // titles
            {
                path: 'titles',
                component: TitlesPageComponent,
                data: {permissions: ['titles.view']}
            },
            {
                path: 'titles/:id/edit',
                component: CrupdateTitleComponent,
                data: {permissions: ['titles.update']}
            },
            {
                path: 'titles/new',
                component: CrupdateTitleComponent,
                data: {permissions: ['titles.create']}
            },

            // people
            {
                path: 'people',
                component: PeoplePageComponent,
                data: {permissions: ['people.view']}
            },
            {
                path: 'people/:id/edit',
                component: CrupdatePersonPageComponent,
                data: {permissions: ['people.update']}
            },
            {
                path: 'people/new',
                component: CrupdatePersonPageComponent,
                data: {permissions: ['people.create']}
            },

            // settings
            {
                path: 'settings',
                component: SettingsComponent,
                resolve: {settings: SettingsResolve},
                data: {permissions: ['settings.view']},
                children: [
                    {
                        path: 'content',
                        component: ContentSettingsComponent,
                    },
                    ...vebtoSettingsRoutes,
                ],
            },
            ...vebtoAdminRoutes,
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
