import {ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {VideoService} from '../video.service';
import {finalize} from 'rxjs/operators';
import {Toast} from '../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../toast-messages';
import {UploadQueueService} from '../../../../common/uploads/upload-queue/upload-queue.service';
import {CurrentUser} from '../../../../common/auth/current-user';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'delete-video-modal',
    templateUrl: './delete-video-modal.component.html',
    styleUrls: ['./delete-video-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UploadQueueService],
})
export class DeleteVideoModalComponent {
    public loading$ = new BehaviorSubject(false);
    public step = "initial";
    public videoForm = this.fb.group({
        url: []
    });

    constructor(
        private fb: FormBuilder,
        private videos: VideoService,
        private toast: Toast,
        private dialogRef: MatDialogRef<DeleteVideoModalComponent>,
        public currentUser: CurrentUser,
    ) {}

    public submit() {
        this.loading$.next(true);
        this.deleteVideo();
    }

    public next() {
        this.step = "confirm";
    }

    private deleteVideo() {
        const payload = this.videoForm.value;
        if (payload.url) {
            this.videos.deleteByUrl(payload.url)
                .pipe(finalize(() => this.loading$.next(false)))
                .subscribe(() => {
                    this.toast.open(MESSAGES.VIDEO_DELETE_SUCCESS)
                    this.close();
                }, () => {
                    this.toast.open(MESSAGES.VIDEO_DELETE_FAILED)
                });
        }
    }

    public close() {
        this.dialogRef.close();
    }
}
