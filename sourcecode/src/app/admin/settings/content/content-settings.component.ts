import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SettingsPanelComponent} from '../../../../common/admin/settings/settings-panel.component';
import {finalize} from 'rxjs/operators';
import {MESSAGES} from '../../../toast-messages';

@Component({
    selector: 'content-settings',
    templateUrl: './content-settings.component.html',
    styleUrls: ['./content-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ContentSettingsComponent extends SettingsPanelComponent implements OnInit {
    public browseGenres: string[] = [];
    public ageRatings: string[] = [];

    ngOnInit() {
        this.browseGenres = this.settings.getJson('browse.genres', []);
        this.ageRatings = this.settings.getJson('browse.ageRatings', []);
    }

    public updateNews() {
        this.loading = true;
        this.artisan.call({command: 'news:update'})
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.toast.open(MESSAGES.NEWS_MANUALLY_UPDATE_SUCCESS);
            });
    }

    public updateLists() {
        this.loading = true;
        this.artisan.call({command: 'lists:update'})
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.toast.open(MESSAGES.LISTS_MANUALLY_UPDATE_SUCCESS);
            });
    }

    public saveSettings() {
        const settings = this.state.getModified();
        settings.client['browse.genres'] = JSON.stringify(this.browseGenres);
        settings.client['browse.ageRatings'] = JSON.stringify(this.ageRatings);
        super.saveSettings(settings);
    }

    public createSitemap() {
        this.loading = true;
        return this.artisan.call({command: 'sitemap:generate'})
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.toast.open(MESSAGES.SITEMAP_GENERATED);
            });
    }
}
