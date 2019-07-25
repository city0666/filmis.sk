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
import {ConfirmModalComponent} from '../../../../common/core/ui/confirm-modal/confirm-modal.component';
import {getFaviconFromUrl} from '../../../../common/core/utils/get-favicon-from-url';
import {Router} from '@angular/router';

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
        private router: Router,
    ) {}

    public openAddVideoModal() {
        if (this.currentUser.isLoggedIn()) {
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
        } else {
            this.router.navigate(['/login']);
        }
    }

    public openEditVideoModal(video?: Video) {
        this.modal.open(
            AddVideoModalComponent,
            {video, mediaItem: this.mediaItem},
            {panelClass: 'add-video-modal-container'}
        ).beforeClosed().subscribe(changedVideo => {
            var videos = this.mediaItem.videos;
            for (var i = 0; i < videos.length; i++) {
                if (videos[i].id === changedVideo.id) {
                    this.mediaItem.videos[i] = changedVideo;
                }
            }
            this.changeDetector.detectChanges();
        });
    }

    public openDeleteVideoModal(video?: Video) {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Video',
            body:  'Are you sure you want to delete this video',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.videoApi.delete([video.id]).subscribe(() => {
                var videos = this.mediaItem.videos;
                for (var i = 0; i < videos.length; i++) {
                    if (videos[i].id === video.id) {
                        this.mediaItem.videos.splice(i, 1);
                        break;
                    }
                }
                this.changeDetector.detectChanges();
            });
            
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

    public getApproval(permission: string, userId: number) {
        return this.currentUser.isLoggedIn() && (this.currentUser.hasPermission(permission) || this.currentUser.get('id') == userId);
    }
}
