import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, OnDestroy} from '@angular/core';
import {MatSort} from '@angular/material';
import {PaginatedDataTableSource} from '../admin/data-table/data/paginated-data-table-source';
import {UrlAwarePaginator} from '../admin/pagination/url-aware-paginator.service';
import {Modal} from '../core/ui/dialogs/modal.service';
import {CurrentUser} from '../auth/current-user';
import {Settings} from '../core/config/settings.service';
import {TitleUrlsService} from '../../app/site/titles/title-urls.service';
import {ConfirmModalComponent} from '../core/ui/confirm-modal/confirm-modal.component';
import {VideoService} from '../../app/site/videos/video.service';
import {Video} from '../../app/models/video';
import {AddVideoModalComponent} from '../../app/site/videos/add-video-modal/add-video-modal.component';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'account-videos',
    templateUrl: './account-videos.component.html',
    styleUrls: ['./account-videos.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountVideosComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Video>;
    public sourceControl = new FormControl(null);
    public userControl = new FormControl(null);

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
            uri: `videos/user/${this.currentUser.get('id')}`,
            dataPaginator: this.paginator,
            matSort: this.matSort
        });

        this.sourceControl.valueChanges.subscribe(value => {
            this.dataSource.refresh({source: value});
        });

        this.userControl.valueChanges.subscribe(value => {
            this.dataSource.refresh({user: value});
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

    public getVideoSource(source: String) {
        let result = "video";
        switch (source) {
            case 'local':
                result = 'full movie';
                break;
            case 'tmdb':
                result = 'trailer';
                break;
        }
        return result;
    }

    public getVideoType(type: String) {
        let result = "";
        switch(type) {
            case 'embed':
                result = 'embed';
                break;
            case 'external':
                result = 'link';
                break;
        }
        return result;
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