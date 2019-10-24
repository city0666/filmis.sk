import {Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnInit} from '@angular/core';
import {Modal} from '../../../../common/core/ui/dialogs/modal.service';
import {AddVideoModalComponent} from '../add-video-modal/add-video-modal.component';
import {Store, Select} from '@ngxs/store';
import {BehaviorSubject, Observable} from 'rxjs';
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
import { Settings } from 'common/core/config/settings.service';
import { PopupService } from 'common/admin/ads/popups/popups.service';
import { HydratePopup, UpdatePopup } from 'common/admin/ads/crupdate-popups.actions';
import { CrupdatePopupState } from 'common/admin/ads/crupdate-popups.state';
import { Popup } from 'app/models/popup';

@Component({
    selector: 'videos-panel',
    templateUrl: './videos-panel.component.html',
    styleUrls: ['./videos-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideosPanelComponent implements OnInit{
    @Input() mediaItem: Title|Episode;
    @Select(CrupdatePopupState.popups) popups$: Observable<Popup[]>;

    public loading$ = new BehaviorSubject(false);
    private adsCounter = 0;
    private currentVideoId = -1;
    private popups: Popup[];
    public title: any;

    constructor(
        private modal: Modal,
        private store: Store,
        private videoApi: VideoService,
        private changeDetector: ChangeDetectorRef,
        public currentUser: CurrentUser,
        private router: Router,
        public settings: Settings,
    ) {}

    ngOnInit () {
        this.popups$.subscribe(popups => {
            this.popups = popups;
        });
        this.hydratePopups();
        this.title = this.mediaItem;
        if (this.title.season_count) {
            this.handleOnChange({ target: { value: this.title.seasons[0].number }});
        }
    }

    public handleOnChange(e) {
        const season = e.target.value;
        const title: any = this.mediaItem;
        this.mediaItem.videos = title.all_videos.filter(video => video.season == season);
    }

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
        if (this.showVideo(video)) {
            this.adsCounter = 0;
            if (video.type === 'external') {
                window.open(video.url, '_blank');
            } else {
                this.store.dispatch(new PlayVideo(video, this.mediaItem));
            }
        }
    }

    public showVideo(video: Video): boolean {
        if (this.currentVideoId != video.id) {
            this.currentVideoId = video.id;
            this.adsCounter = 0;
        }
        if (!this.settings.get('popups.disable')) {
            let flag = false;
            if (
                this.settings.get('popups.full_movie') && video.source == 'local' || 
                this.settings.get('popups.trailer') && video.source == 'tmdb' ||
                this.settings.get('popups.video') && video.source == 'video'
            ) {
                flag = true;
            }
            const countPopups = this.popups.length;
            const itemsToShow = this.settings.get('popups.items_count');
            const max = countPopups > itemsToShow ? itemsToShow : countPopups;
            if (flag && max > this.adsCounter) {
                let popup;
                if (this.settings.get('popups.random')) {
                    const rand = Math.floor(Math.random() * countPopups);
                    popup = this.popups[rand];
                } else {
                    popup = this.popups[this.adsCounter];
                }
                this.store.dispatch(new UpdatePopup(popup.id, this.addViews(popup)));
                window.open(popup.url, '_blank', 'toolbar=0,location=0,menubar=0');
                this.adsCounter++;
                return false;
            }
        }
        return true;
    }

    public getThumbnail(video: Video) {
        const title: any = this.mediaItem;
        if (title.episodes && title.episodes.length && video.episode_id) {
            return title.episodes.find(t => t.id == video.episode_id).poster;
        } 
        return video.thumbnail || this.mediaItem['backdrop'] || this.mediaItem.poster;
    }

    public getFavicon(url: string) {
        return getFaviconFromUrl(url);
    }

    public getApproval(permission: string, userId: number) {
        return this.currentUser.isLoggedIn() && (this.currentUser.hasPermission(permission) || this.currentUser.get('id') == userId);
    }

    private hydratePopups() {
        this.store.dispatch(new HydratePopup()).subscribe(() => {
            this.popups = this.store.selectSnapshot(CrupdatePopupState.popups);
        })
    }
    
    private addViews(popup: Popup): Popup {
        const views = +JSON.parse(JSON.stringify(popup.views)) + 1;
        const newPopup = new Popup({
            name: popup.name,
            url: popup.url,
            views: views
        });
        return newPopup;
    }
}
