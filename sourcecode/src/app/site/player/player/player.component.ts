import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, HostBinding} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {PlayerState} from '../state/player-state';
import {BehaviorSubject, Observable} from 'rxjs';
import {Video} from '../../../models/video';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {youtubePlayerUrlParams} from '../youtube-player-params';
import {OverlayPanelRef} from '../../../../common/core/ui/overlay-panel/overlay-panel-ref';
import {PlayerOverlayClosed, PlayerOverlayOpened, PlayVideo, ToggleSidebar} from '../state/player-state-actions';
import {Title} from '../../../models/title';
import {BreakpointsService} from '../../../../common/core/ui/breakpoints.service';
import {Episode} from '../../../models/episode';

@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit, OnDestroy {
    @Select(PlayerState.activeVideo) activeVideo$: Observable<Video>;
    @Select(PlayerState.relatedVideos) relatedVideos$: Observable<Video[]>;
    @Select(PlayerState.mediaItem) mediaItem$: Observable<Title|Episode>;
    @Select(PlayerState.sidebarOpen) sidebarOpen$: Observable<boolean>;

    public safeUrl$: BehaviorSubject<SafeResourceUrl> = new BehaviorSubject(null);
    @HostBinding('class.minimized') public minimized = false;

    constructor(
        private store: Store,
        private sanitizer: DomSanitizer,
        private overlayRef: OverlayPanelRef,
        public breakpoints: BreakpointsService,
    ) {}

    ngOnInit() {
        this.store.dispatch(new PlayerOverlayOpened());
        this.activeVideo$.subscribe(video => {
            this.safeUrl$.next(this.sanitizer.bypassSecurityTrustResourceUrl(video.url + youtubePlayerUrlParams()));
        });

        // hide sidebar on mobile
        if (this.breakpoints.isMobile$.value) {
            this.toggleSidebar();
        }
    }

    ngOnDestroy() {
        this.store.dispatch(new PlayerOverlayClosed());
    }

    public playVideo(video: Video) {
        this.store.dispatch(new PlayVideo(video, video.title));
    }

    public toggleSidebar() {
        this.store.dispatch(new ToggleSidebar());
    }

    public close() {
        this.overlayRef.close();
    }

    public isTableOrMobile() {
        return this.breakpoints.isMobile$.value ||
            this.breakpoints.isTablet$.value;
    }
}
