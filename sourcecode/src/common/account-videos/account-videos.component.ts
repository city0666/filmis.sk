import {
    Component, ComponentFactoryResolver, Inject, OnInit, Optional, ViewChild, ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Users} from '../auth/users.service';
import {AuthService} from '../auth/auth.service';
import {Toast} from '../core/ui/toast.service';
import {UploadsApiService} from '../uploads/uploads-api.service';
import {Settings} from '../core/config/settings.service';
import {User} from '../core/types/models/User';
import {Translations} from '../core/translations/translations.service';
import {Localizations} from '../core/translations/localizations.service';
import {CurrentUser} from '../auth/current-user';
import {ComponentType} from '@angular/cdk/portal';
import { ErrorsModel } from 'common/account-settings/account-settings-types';

@Component({
    selector: 'account-videos',
    templateUrl: './account-videos.component.html',
    styleUrls: ['./account-videos.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccountVideosComponent implements OnInit {
    @ViewChild('extraPanelRef', {read: ViewContainerRef}) extraPanelRef: ViewContainerRef;

    public user = new User();

    constructor(
        public settings: Settings,
        private route: ActivatedRoute,
        private users: Users,
        private currentUser: CurrentUser,
        private toast: Toast,
        private i18n: Translations,
        public auth: AuthService,
    ) {}

    ngOnInit() {
        console.log('On Init is Loaded');
        this.route.data.subscribe(data => {
            this.user = data['resolves']['user'];
        });
    }
}