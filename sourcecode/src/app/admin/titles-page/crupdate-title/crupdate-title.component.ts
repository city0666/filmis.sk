import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {ResetState} from './state/crupdate-title-actions';
import {CrupdateTitleState} from './state/crupdate-title-state';
import {Observable} from 'rxjs';
import {Title} from '../../../models/title';

@Component({
    selector: 'crupdate-title',
    templateUrl: './crupdate-title.component.html',
    styleUrls: ['./crupdate-title.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateTitleComponent implements OnInit, OnDestroy {
    @Select(CrupdateTitleState.loading) loading$: Observable<boolean>;
    @Select(CrupdateTitleState.title) title$: Observable<Title>;
    private activePanel = 'primaryFacts';

    constructor(
        private store: Store,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.active) this.activePanel = params.active;
        });
    }

    ngOnDestroy() {
        this.store.dispatch(new ResetState());
    }

    public openPanel(name: string) {
        this.router.navigate([], {queryParams: {active: name}});
    }

    public panelIsOpen(name: string) {
        return this.activePanel === name;
    }

    public titleCreated(): boolean {
        return !!this.store.selectSnapshot(CrupdateTitleState.title).id;
    }
}
