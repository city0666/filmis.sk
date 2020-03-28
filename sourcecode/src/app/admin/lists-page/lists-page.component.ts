import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, OnDestroy} from '@angular/core';
import {MatSort} from '@angular/material';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {UrlAwarePaginator} from '../../../common/admin/pagination/url-aware-paginator.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {Settings} from '../../../common/core/config/settings.service';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {ListsService} from '../../site/lists/lists.service';
import {List} from '../../models/list';

@Component({
    selector: 'lists-page',
    templateUrl: './lists-page.component.html',
    styleUrls: ['./lists-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListsPageComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<List>;

    constructor(
        public paginator: UrlAwarePaginator,
        private lists: ListsService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<List>({
            uri: 'lists',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {
                excludeSystem: true,
                with: 'user',
                withCount: 'items',
            }
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public deleteSelectedLists() {
        const ids = this.dataSource.getSelectedItems();
        this.lists.delete(ids).subscribe(() => {
            this.paginator.refresh();
            this.dataSource.selectedRows.clear();
        });
    }

    public maybeDeleteSelectedLists() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Lists',
            body:  'Are you sure you want to delete selected lists?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedLists();
        });
    }
}
