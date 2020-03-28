import {Component, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {Observable} from 'rxjs';
import {Image} from '../../../../../models/image';
import {openUploadWindow} from '../../../../../../common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '../../../../../../common/uploads/upload-input-config';
import {UploadQueueService} from '../../../../../../common/uploads/upload-queue/upload-queue.service';
import {ImagesService} from '../../../../../site/shared/images.service';
import {AddImage, DeleteImage} from '../../state/crupdate-title-actions';
import {Toast} from '../../../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../../../toast-messages';

@Component({
    selector: 'images-panel',
    templateUrl: './images-panel.component.html',
    styleUrls: ['./images-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [UploadQueueService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagesPanelComponent {
    @Select(CrupdateTitleState.images) images$: Observable<Image[]>;

    constructor(
        private images: ImagesService,
        private store: Store,
        private toast: Toast,
    ) {}

    public uploadImage() {
        openUploadWindow({types: [UploadInputTypes.image]}).then(upload => {
            const params = {
                modelId: this.store.selectSnapshot(CrupdateTitleState.title).id
            };
            this.images.create(upload[0], params)
                .subscribe(response => {
                    this.store.dispatch(new AddImage(response.image)).subscribe(() => {
                        this.toast.open(MESSAGES.IMAGE_CREATE_SUCCESS);
                    });
                });
        });
    }

    public deleteImage(image: Image) {
        this.store.dispatch(new DeleteImage(image)).subscribe(() => {
            this.toast.open(MESSAGES.IMAGE_DELETE_SUCCESS);
        });
    }
}
