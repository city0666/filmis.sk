import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ViewChild,
    OnDestroy
} from '@angular/core';
import {MatSort} from '@angular/material';
import {Store} from '@ngxs/store';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {Modal} from '../../../../../../common/core/ui/dialogs/modal.service';
import {Toast} from '../../../../../../common/core/ui/toast.service';
import {PaginatedDataTableSource} from '../../../../../../common/admin/data-table/data/paginated-data-table-source';
import {Review} from '../../../../../models/review';
import {UrlAwarePaginator} from '../../../../../../common/admin/pagination/url-aware-paginator.service';
import {CurrentUser} from '../../../../../../common/auth/current-user';
import {CrupdateReviewModalComponent} from '../../../../../site/reviews/crupdate-review-modal/crupdate-review-modal.component';
import {ConfirmModalComponent} from '../../../../../../common/core/ui/confirm-modal/confirm-modal.component';
import {ReviewService} from '../../../../../site/shared/review.service';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'reviews-panel',
    templateUrl: './reviews-panel.component.html',
    styleUrls: ['./reviews-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UrlAwarePaginator],
})
export class ReviewsPanelComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Review>;

    constructor(
        private store: Store,
        private modal: Modal,
        private toast: Toast,
        private reviews: ReviewService,
        public paginator: UrlAwarePaginator,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.paginator.ignoreQueryParams = true;
        this.dataSource = new PaginatedDataTableSource<Review>({
            uri: 'reviews',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {compact: true},
            delayInit: true,
        });

        const sub = this.store.select(CrupdateTitleState.title)
            .pipe(filter(title => !!title.id))
            .subscribe(title => {
                this.dataSource.init({titleId: title.id});
                // need to unsub because reviews will be updated
                // with every sidebar item click / query param change
                sub.unsubscribe();
            });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public openCrupdateReviewModal(review?: Review) {
        const mediaId = this.store.selectSnapshot(CrupdateTitleState.title).id;
        this.modal.open(
            CrupdateReviewModalComponent,
            {review, mediaId},
            {panelClass: 'crupdate-review-modal-container'}
        ).beforeClosed().subscribe(newReview => {
            if (newReview) {
                this.dataSource.refresh();
            }
        });
    }

    public maybeDeleteSelectedReviews() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Reviews',
            body:  'Are you sure you want to delete selected reviews?',
            ok:    'Delete'
        }).beforeClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            const ids = this.dataSource.getSelectedItems();
            this.reviews.delete(ids).subscribe(() => {
                this.dataSource.refresh();
            });
        });
    }
}
