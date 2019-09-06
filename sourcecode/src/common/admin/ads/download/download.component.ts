import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Settings} from '../../../core/config/settings.service';
import {Toast} from '../../../core/ui/toast.service';
import {finalize} from 'rxjs/operators';
import { HttpErrors } from '../../../core/http/errors/http-errors.enum';

@Component({
    selector: 'download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DownloadComponent implements OnInit {
    public model = {};
    public loading = false;

    constructor(
        public settings: Settings,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.hydrate();
    }

    public saveAds() {
        this.loading = true;
        this.settings.save({client: this.model})
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.toast.open('Ads have been updated.');
            }, () => {
                this.toast.open(HttpErrors.Default);
            });
    }

    public hydrate() {
        this.model['button.website'] = this.settings.get('button.website');
        this.model['button.referral'] = this.settings.get('button.referral');
        this.model['button.useTitle'] = this.settings.get('button.useTitle');
        this.model['button.disable'] = this.settings.get('button.disable');
    }
}
