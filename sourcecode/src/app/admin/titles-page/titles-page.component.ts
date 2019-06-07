import {Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material';
import {UrlAwarePaginator} from '../../../common/admin/pagination/url-aware-paginator.service';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {Title} from '../../models/title';
import {TitlesService} from '../../site/titles/titles.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {Settings} from '../../../common/core/config/settings.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {ImportMediaModalComponent} from '../../site/shared/import-media-modal/import-media-modal.component';
import {MEDIA_TYPE} from '../../site/media-type';
import {Router} from '@angular/router';

@Component({
    selector: 'titles-page',
    templateUrl: './titles-page.component.html',
    styleUrls: ['./titles-page.component.scss'],
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None,
})
export class TitlesPageComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Title>;

    constructor(
        public paginator: UrlAwarePaginator,
        private titleService: TitlesService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Title>({
            uri: 'titles',
            dataPaginator: this.paginator,
            matSort: this.matSort
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public deleteSelectedTitles() {
        const ids = this.dataSource.selectedRows.selected.map(title => title.id);

        this.titleService.delete(ids).subscribe(() => {
            this.paginator.refresh();
            this.dataSource.selectedRows.clear();
        });
    }

    public maybeDeleteSelectedTitles() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Titles',
            body:  'Are you sure you want to delete selected titles?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedTitles();
        });
    }

    public openImportMediaModal() {
        this.modal.open(
            ImportMediaModalComponent,
            {mediaTypes: [MEDIA_TYPE.MOVIE, MEDIA_TYPE.SERIES]},
        ).beforeClosed().subscribe(mediaItem => {
            if (mediaItem) {
                this.router.navigate(['/admin/titles', mediaItem.id, 'edit']);
            }
        });
    }
}
