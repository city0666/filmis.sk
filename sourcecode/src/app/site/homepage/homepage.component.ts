import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {HomepageState} from './state/homepage-state';
import {Observable} from 'rxjs';
import {List} from '../../models/list';
import {ToggleGlobalLoader} from '../../state/app-state-actions';

@Component({
    selector: 'homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HomepageComponent implements OnInit {
    @Select(HomepageState.content) content$: Observable<List[]>;

    constructor(private store: Store) {}

    ngOnInit() {
        setTimeout(() => this.store.dispatch(new ToggleGlobalLoader(false)));
    }
}
