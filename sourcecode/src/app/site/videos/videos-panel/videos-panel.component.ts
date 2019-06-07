import {Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef} from '@angular/core';
import {Modal} from '../../../../common/core/ui/dialogs/modal.service';
import {AddVideoModalComponent} from '../add-video-modal/add-video-modal.component';
import {Store} from '@ngxs/store';
import {BehaviorSubject} from 'rxjs';
import {Video} from '../../../models/video';
import {VideoService} from '../video.service';
import {finalize} from 'rxjs/operators';
import {PlayVideo} from '../../player/state/player-state-actions';
import {Title} from '../../../models/title';
import {Episode} from '../../../models/episode';
import {CurrentUser} from '../../../../common/auth/current-user';
import {getFaviconFromUrl} from '../../../../common/core/utils/get-favicon-from-url';

@Component({
    selector: 'videos-panel',
    templateUrl: './videos-panel.component.html',
    styleUrls: ['./videos-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideosPanelComponent {
    @Input() mediaItem: Title|Episode;
    public loading$ = new BehaviorSubject(false);

    constructor(
        private modal: Modal,
        private store: Store,
        private videoApi: VideoService,
        private changeDetector: ChangeDetectorRef,
        public currentUser: CurrentUser,
    ) {}

    public openAddVideoModal() {
        this.modal.open(
            AddVideoModalComponent,
            {mediaItem: this.mediaItem},
            {panelClass: 'add-video-modal-container'}
        ).beforeClosed().subscribe(video => {
            if ( ! video) return;
            // TODO: should use store here probably to make it cleaner
            this.mediaItem.videos = [...this.mediaItem.videos, video];
            this.changeDetector.detectChanges();
        });
    }

    public rateVideo(video: Video, rating: 'positive'|'negative') {
        this.loading$.next(true);
        this.videoApi.rate(video.id, rating)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                video.positive_votes = response.video.positive_votes;
                video.negative_votes = response.video.negative_votes;
            });
    }

    public playVideo(video: Video) {
        if (video.type === 'external') {
            window.open(video.url, '_blank');
        } else {
            this.store.dispatch(new PlayVideo(video, this.mediaItem));
        }
    }

    public getThumbnail(video: Video) {
        return video.thumbnail || this.mediaItem['backdrop'] || this.mediaItem.poster;
    }

    public getFavicon(url: string) {
        return getFaviconFromUrl(url);
    }
}
