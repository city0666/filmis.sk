import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, OnDestroy} from '@angular/core';
import {MatSort} from '@angular/material';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {UrlAwarePaginator} from '../../../common/admin/pagination/url-aware-paginator.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {Settings} from '../../../common/core/config/settings.service';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {VideoService} from '../../site/videos/video.service';
import {Video} from '../../models/video';
import {AddVideoModalComponent} from '../../site/videos/add-video-modal/add-video-modal.component';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'videos-page',
    templateUrl: './videos-page.component.html',
    styleUrls: ['./videos-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideosPageComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Video>;
    public sourceControl = new FormControl(null);

    constructor(
        public paginator: UrlAwarePaginator,
        private videos: VideoService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Video>({
            uri: 'videos',
            dataPaginator: this.paginator,
            matSort: this.matSort,
        });

        this.sourceControl.valueChanges.subscribe(value => {
            this.dataSource.refresh({source: value});
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public deleteSelectedPeople() {
        const ids = this.dataSource.selectedRows.selected.map(title => title.id);
        this.videos.delete(ids).subscribe(() => {
            this.paginator.refresh();
            this.dataSource.selectedRows.clear();
        });
    }

    public maybeDeleteSelectedPeople() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Videos',
            body:  'Are you sure you want to delete selected videos',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedPeople();
        });
    }

    public openCrupdateVideoModal(video?: Video) {
        this.modal.open(
            AddVideoModalComponent,
            {video, mediaItem: video.title},
            {panelClass: 'add-video-modal-container'}
        ).beforeClosed().subscribe(changedVideo => {
            if (changedVideo) {
                this.dataSource.refresh();
            }
        });
    }
}
