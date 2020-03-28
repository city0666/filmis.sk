import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {PeopleService} from '../people.service';
import {InfiniteScroll} from '../../../../common/core/ui/infinite-scroll/infinite.scroll';
import {BehaviorSubject} from 'rxjs';
import {PaginationResponse} from '../../../../common/core/types/pagination-response';
import {Person} from '../../../models/person';
import {finalize} from 'rxjs/operators';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {Settings} from '../../../../common/core/config/settings.service';

@Component({
    selector: 'people-index',
    templateUrl: './people-index.component.html',
    styleUrls: ['./people-index.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleIndexComponent extends InfiniteScroll implements OnInit {
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public people$: BehaviorSubject<PaginationResponse<Person>> = new BehaviorSubject(null);

    constructor(
        private people: PeopleService,
        public urls: TitleUrlsService,
        public settings: Settings
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadPeople();
    }

    private loadPeople() {
        this.loading$.next(true);
        const page = this.people$.value ? (this.people$.value.current_page + 1) : 1;
        this.people.getAll({perPage: 12, page})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                if (this.people$.value) {
                    response.pagination.data = [...this.people$.value.data, ...response.pagination.data];
                }
                this.people$.next(response.pagination);
            });
    }

    protected loadMoreItems() {
        this.loadPeople();
    }

    protected canLoadMore() {
        return !this.isLoading() && this.people$.value.current_page < this.people$.value.last_page;
    }

    protected isLoading() {
        return this.loading$.value;
    }
}
