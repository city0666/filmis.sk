import {Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material';
import {UrlAwarePaginator} from '../../../common/admin/pagination/url-aware-paginator.service';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {Settings} from '../../../common/core/config/settings.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {NewsArticle} from '../../models/news-article';
import {NewsService} from '../../site/news/news.service';
import {Toast} from '../../../common/core/ui/toast.service';
import {MESSAGES} from '../../toast-messages';

@Component({
    selector: 'news-page',
    templateUrl: './news-page.component.html',
    styleUrls: ['./news-page.component.scss'],
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None,
})
export class NewsPageComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<NewsArticle>;

    constructor(
        public paginator: UrlAwarePaginator,
        private news: NewsService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<NewsArticle>({
            uri: 'news',
            dataPaginator: this.paginator,
            matSort: this.matSort
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public deleteSelectedArticles() {
        const ids = this.dataSource.selectedRows.selected.map(title => title.id);

        this.news.delete({ids}).subscribe(() => {
            this.paginator.refresh();
            this.dataSource.selectedRows.clear();
            this.toast.open(MESSAGES.NEWS_DELETE_SUCCESS);
        });
    }

    public maybeDeleteSelectedArticles() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Articles',
            body:  'Are you sure you want to delete selected articles?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedArticles();
        });
    }
}
