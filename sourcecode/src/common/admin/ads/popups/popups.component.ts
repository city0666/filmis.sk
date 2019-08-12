import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Settings} from '../../../core/config/settings.service';
import {Toast} from '../../../core/ui/toast.service';
import {finalize} from 'rxjs/operators';
import { HttpErrors } from '../../../core/http/errors/http-errors.enum';

@Component({
    selector: 'popups',
    templateUrl: './popups.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PopupsComponent implements OnInit {
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
        let items = [
            'disable',
            'random',
            'items_count',
            'full_movie',
            'trailer',
            'video'
        ];
        for (let item of items) {
            this.model[`popups.${item}`] = this.settings.get(`popups.${item}`);
        }
    }
}
