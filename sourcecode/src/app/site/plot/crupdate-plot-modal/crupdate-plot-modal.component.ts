import {Component, ViewEncapsulation, ChangeDetectionStrategy, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Toast} from '../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../toast-messages';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BackendErrorMessages} from '../../../../common/core/types/backend-error-response';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import { Title } from 'app/models/title';
import { TitlesService } from 'app/site/titles/titles.service';

interface CrupdatePlotModalData {
    title?: Title;
}

@Component({
    selector: 'crupdate-plot-modal',
    templateUrl: './crupdate-plot-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdatePlotModalComponent {
    public errors$: BehaviorSubject<BackendErrorMessages> = new BehaviorSubject({});
    public loading$ = new BehaviorSubject(false);

    public form = this.fb.group({
        description: ['', [Validators.minLength(1)]],
    });
    
    public title = new FormGroup({
        description: new FormControl('', Validators.minLength(1)),
    });

    constructor(
        private dialogRef: MatDialogRef<CrupdatePlotModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdatePlotModalData,
        private toast: Toast,
        private fb: FormBuilder,
        private titles: TitlesService
    ) {}

    public close(title?: Partial<Title>) {
        this.dialogRef.close(title);
    }

    public confirm() {
        this.loading$.next(true);

        const observable = this.titles.update(this.data.title.id, this.form.value);

        observable
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open(MESSAGES.TITLE_UPDATE_SUCCESS);
                this.close(response.title);
            }, errorResponse => {
                this.errors$.next(errorResponse.messages);
            });
    }
}
