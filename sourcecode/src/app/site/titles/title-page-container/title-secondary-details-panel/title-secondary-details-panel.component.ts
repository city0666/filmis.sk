import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, ViewEncapsulation } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TitleState } from '../../state/title-state';
import { Observable } from 'rxjs';
import { Title, TitleCredit } from '../../../../models/title';
import { Video } from '../../../../models/video';
import { PlayVideo } from '../../../player/state/player-state-actions';
import { Episode } from '../../../../models/episode';
import { MEDIA_TYPE } from '../../../media-type';
import { Season } from '../../../../models/season';
import { CurrentUser } from 'common/auth/current-user';
import { UpdateTitle, CrupdateReview } from '../../state/title-actions';
import { CrupdatePlotModalComponent } from 'app/site/plot/crupdate-plot-modal/crupdate-plot-modal.component';
import { Modal } from 'common/core/ui/dialogs/modal.service';
import { CrupdateReviewModalComponent } from 'app/site/reviews/crupdate-review-modal/crupdate-review-modal.component';

@Component({
    selector: 'title-secondary-details-panel',
    templateUrl: './title-secondary-details-panel.component.html',
    styleUrls: ['./title-secondary-details-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TitleSecondaryDetailsPanelComponent implements OnChanges {
    @Select(TitleState.title) title$: Observable<Title>;
    @Select(TitleState.videoCoverImage) videoCoverImage$: Observable<string>;
    @Select(TitleState.trailer) trailer$: Observable<Video>;
    @Select(TitleState.seasons) seasons$: Observable<Season[]>;

    @Input() item: Title | Episode;

    private expanded = false;
    public buttonText = "more";

    public credits: {
        director?: TitleCredit,
        writers?: TitleCredit[],
        creators?: TitleCredit[],
        cast?: TitleCredit[],
    };

    constructor(private store: Store, public currentUser: CurrentUser, private modal: Modal) { }

    ngOnChanges(changes: { item: SimpleChange }) {
        if (changes.item.currentValue && changes.item.currentValue.credits) {
            this.setCrew();
            this.expanded = false;
            this.buttonText = "more";
        }
    }

    public playVideo(video: Video) {
        const title = this.store.selectSnapshot(TitleState.title);
        this.store.dispatch(new PlayVideo(video, title));
    }

    public openCrupdateReviewModal() {
        const review = (this.store.selectSnapshot(TitleState.reviews) || [])
            .find(curr => curr.user_id === this.currentUser.get('id'));
        const mediaId = this.store.selectSnapshot(TitleState.title).id;
        this.modal.open(
            CrupdateReviewModalComponent,
            {review, mediaId},
            'crupdate-review-modal-container'
        ).beforeClosed().subscribe(newReview => {
            if (newReview) {
                this.store.dispatch(new CrupdateReview(newReview));
            }
        });
    }


    public openUpdatePlotModal() {
        const title = this.store.selectSnapshot(TitleState.title);
        this.modal.open(
            CrupdatePlotModalComponent,
            { title },
            'crupdate-plot-modal-container'
        ).beforeClosed().subscribe(updatedTitle => {
            this.store.dispatch(new UpdateTitle(updatedTitle));
        });
    }

    public isSeries() {
        return this.item.type === MEDIA_TYPE.TITLE && this.item.is_series;
    }

    private setCrew() {
        const credits = this.store.selectSnapshot(TitleState.titleOrEpisodeCredits);
        this.credits = {
            director: this.getDirector(credits),
            writers: this.getWriters(credits),
            cast: this.getCast(credits),
            creators: this.getCreators(credits),
        };
    }

    public getDirector(credits: TitleCredit[]) {
        return credits.find(person => person.pivot.department === 'directing');
    }

    private getWriters(credits: TitleCredit[]) {
        return credits.filter(person => person.pivot.department === 'writing');
    }

    private getCast(credits: TitleCredit[]) {
        return credits.filter(person => person.pivot.department === 'cast').slice(0, 3);
    }

    private getCreators(credits: TitleCredit[]) {
        return credits.filter(person => person.pivot.department === 'creators');
    }

    public showDescription(description: string) {
        let limit = 320;
        let SUFFIX = "...";
        if (description.length <= limit || this.expanded) {
            return description;
        } else if (this.expanded == false) {
            return description.slice(0, limit - SUFFIX.length) + SUFFIX
        }
    }

    public buttonClick() {
        this.expanded = !this.expanded;
        this.buttonText = this.expanded ? "less" : "more";
    }
}
