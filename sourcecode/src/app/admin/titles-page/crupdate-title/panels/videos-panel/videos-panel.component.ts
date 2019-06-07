import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ViewChild,
} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Select, Store} from '@ngxs/store';
import {Modal} from '../../../../../../common/core/ui/dialogs/modal.service';
import {Toast} from '../../../../../../common/core/ui/toast.service';
import {ConfirmModalComponent} from '../../../../../../common/core/ui/confirm-modal/confirm-modal.component';
import {
    AddVideo,
    ChangeVideosOrder,
    DeleteVideo,
    UpdateVideo
} from '../../state/crupdate-title-actions';
import {MESSAGES} from '../../../../../toast-messages';
import {Video} from '../../../../../models/video';
import {AddVideoModalComponent} from '../../../../../site/videos/add-video-modal/add-video-modal.component';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {Observable} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
    selector: 'videos-panel',
    templateUrl: './videos-panel.component.html',
    styleUrls: ['./videos-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideosPanelComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;
    @Select(CrupdateTitleState.allVideos) videos$: Observable<Video[]>;
    public dataSource = new MatTableDataSource([]);

    constructor(
        private store: Store,
        private dialog: Modal,
        private toast: Toast,
    ) {}

    ngOnInit () {
        this.dataSource.sort = this.matSort;
        this.videos$.subscribe(videos => {
            this.dataSource.data = videos;
        });
    }

    public deleteVideo(video: Video) {
        this.dialog.open(ConfirmModalComponent, {
            title: 'Delete Video',
            body:  'Are you sure you want to delete this video?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.store.dispatch(new DeleteVideo(video)).subscribe(() => {
                this.toast.open(MESSAGES.VIDEO_DELETE_SUCCESS);
            });
        });
    }

    public openCrupdateVideoModal(oldVideo?: Video) {
        const title = this.store.selectSnapshot(CrupdateTitleState.title);
        this.dialog.open(
            AddVideoModalComponent,
            {video: oldVideo, mediaItem: title},
            {panelClass: 'crupdate-video-modal-container'}
        ).beforeClosed().subscribe(newVideo => {
            if (newVideo) {
                if (oldVideo) {
                    this.store.dispatch(new UpdateVideo(newVideo));
                } else {
                    this.store.dispatch(new AddVideo(newVideo));
                }
            }
        });
    }

    public changeVideosOrder(e: CdkDragDrop<Video>) {
        if (this.store.selectSnapshot(CrupdateTitleState.loading)) return;
        this.store.dispatch(new ChangeVideosOrder(e.previousIndex, e.currentIndex));
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value;
    }
}
