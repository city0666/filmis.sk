import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
    SimpleChange,
    ViewChild, OnInit
} from '@angular/core';
import {Select, Store} from '@ngxs/store';
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
import { CrupdatePopupState } from '../../crupdate-popups.state';
import { Observable } from 'rxjs';
import { HydratePopup, ChangePopupOrder } from '../../crupdate-popups.actions';

@Component({
    selector: 'popups-panel',
    templateUrl: './popups-panel.component.html',
    styleUrls: ['./popups-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupsPanelComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;
    @Select(CrupdatePopupState.popups) popups$: Observable<Popup[]>;
    public dataSource = new MatTableDataSource([]);

    constructor(
        private store: Store,
        private dialog: Modal,
        private toast: Toast,
    ) {}

    ngOnInit () {
        this.dataSource.sort = this.matSort;
        this.popups$.subscribe(popups => {
            this.dataSource.data = popups;
        });
        this.hydratePopups();
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value;
    }

    public hydratePopups() {
        this.store.dispatch(new HydratePopup()).subscribe(() => {
            const popups = this.store.selectSnapshot(CrupdatePopupState.popups);
            this.dataSource.data = popups;
        })
    }

    public changePopupsOrder(e: CdkDragDrop<Popup>) {
        if (this.store.selectSnapshot(CrupdatePopupState.loading)) return ;
        this.store.dispatch(new ChangePopupOrder(e.previousIndex, e.currentIndex));
    }

}
