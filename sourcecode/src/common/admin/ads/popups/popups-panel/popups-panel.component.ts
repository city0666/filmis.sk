import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ViewChild, OnInit
} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatSort, MatTableDataSource} from '@angular/material';
import { Toast } from 'common/core/ui/toast.service';
import { Modal } from 'common/core/ui/dialogs/modal.service';
import { Popup } from 'app/models/popup';
import { CrupdatePopupState } from '../../crupdate-popups.state';
import { Observable } from 'rxjs';
import { HydratePopup, ChangePopupOrder, DeletePopup, UpdatePopup, CreatePopup } from '../../crupdate-popups.actions';
import { ConfirmModalComponent } from 'common/core/ui/confirm-modal/confirm-modal.component';
import { AddPopupModalComponent } from '../add-popup-modal/add-popup-modal.component';

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

    public deletePopup(popup: Popup) {
        this.dialog.open(ConfirmModalComponent, {
            title: 'Delete Popup',
            body: 'Are you sure you want to delete this popup?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.store.dispatch(new DeletePopup(popup.id)).subscribe(() => {
                this.toast.open('Popup deleted.');
            })
        })
    }

    public openCrupdatePopupModal(oldPopup?: Popup) {
        this.dialog.open(
            AddPopupModalComponent,
            {popup: oldPopup},
            {panelClass: 'crupdate-video-modal-container'}
        ).beforeClosed().subscribe(newPopup => {
            if (newPopup) {
                if (oldPopup) {
                    this.store.dispatch(new UpdatePopup(oldPopup.id, newPopup)).subscribe(() => {
                        this.toast.open('Popup updated.');
                    });
                } else {
                    this.store.dispatch(new CreatePopup(newPopup)).subscribe(() => {
                        this.toast.open('Popup created.');
                    });
                }
            }
        })
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
        this.store.dispatch(new ChangePopupOrder(e.previousIndex, e.currentIndex)).subscribe(() => {
            this.hydratePopups();
        });
    }

}
