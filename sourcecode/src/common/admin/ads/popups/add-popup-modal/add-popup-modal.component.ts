import {ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { UploadQueueService } from 'common/uploads/upload-queue/upload-queue.service';
import { Toast } from 'common/core/ui/toast.service';
import { Settings } from 'common/core/config/settings.service';
import { CurrentUser } from 'common/auth/current-user';
import { PopupService } from '../popups.service';
import { Popup } from 'app/models/popup';
import { finalize } from 'rxjs/operators';
import { openUploadWindow } from 'common/uploads/utils/open-upload-window';
import { UploadInputTypes } from 'common/uploads/upload-input-config';

interface AddPopupModalData {
    popup?: Popup;
}

@Component({
    selector: 'add-popup-modal',
    templateUrl: './add-popup-modal.component.html',
    styleUrls: ['./add-popup-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UploadQueueService],
})
export class AddPopupModalComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public popupForm = this.fb.group({
        name: [],
        thumbnail: [],
        url: []
    });

    constructor(
        private fb: FormBuilder,
        private popups: PopupService,
        private toast: Toast,
        private uploadQueue: UploadQueueService,
        private settings: Settings,
        private dialogRef: MatDialogRef<AddPopupModalComponent>,
        public currentUser: CurrentUser,
        @Inject(MAT_DIALOG_DATA) public data: AddPopupModalData,
    ) {}

    ngOnInit() {
        this.hydrateForm();
    }

    public confirm() {
        this.loading$.next(true);
        if (this.data.popup) {
            this.updateVideo();
        } else {
            this.createVideo();
        }
    }

    private createVideo() {
        this.popups.create(this.getPayload())
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open('Popup created.');
                this.close(response.popup);
            }, () => {
                this.toast.open('Popup failed.');
            });
    }

    private updateVideo() {
        this.popups.update(this.data.popup.id, this.getPayload())
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open('Popup updated.');
                this.close(response.popup);
            }, () => {
                this.toast.open('Popup update failed.');
            });
    }

    public close(popup?: Popup) {
        this.dialogRef.close(popup);
    }

    private getPayload() {
        const payload = this.popupForm.value;
        return payload;
    }

    public uploadThumbnail() {
        openUploadWindow({types: [UploadInputTypes.image]}).then(upload => {
            const params = {
                uri: 'uploads/images',
                httpParams: {
                    path: 'media-images/videos'
                },
            };

            this.uploadQueue.start(upload, params).subscribe(fileEntry => {
                this.popupForm.patchValue({
                    thumbnail: this.settings.getBaseUrl(true) + fileEntry.url
                });
            });
        });
    }

    public getIterableFromNumber(number) {
        return Array.from(new Array(number), (v, i) => i + 1);
    }


    private hydrateForm() {
        // set specified video
        if (this.data.popup) {
            this.popupForm.patchValue(this.data.popup);
        }
    }
}
