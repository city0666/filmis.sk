import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
    SimpleChange,
    ViewChild, OnInit, OnDestroy
} from '@angular/core';
import {Store} from '@ngxs/store';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatSort, MatTableDataSource} from '@angular/material';
import { Toast } from 'common/core/ui/toast.service';
import { Modal } from 'common/core/ui/dialogs/modal.service';
import { PaginatedDataTableSource } from 'common/admin/data-table/data/paginated-data-table-source';
import { Popup } from 'app/models/popup';
import { UrlAwarePaginator } from 'common/admin/pagination/url-aware-paginator.service';
import { PopupService } from '../popups.service';
import { CurrentUser } from 'common/auth/current-user';
import { Settings } from 'common/core/config/settings.service';
import { Router } from '@angular/router';

@Component({
    selector: 'popups-panel',
    templateUrl: './popups-panel.component.html',
    styleUrls: ['./popups-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupsPanelComponent implements OnDestroy, OnInit {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Popup>;

    constructor(
        public paginator: UrlAwarePaginator,
        private popupService: PopupService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public router: Router,
    ) {}

    ngOnInit () {
        this.dataSource = new PaginatedDataTableSource<Popup>({
            uri: 'popups',
            dataPaginator: this.paginator,
            matSort: this.matSort
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }
}
