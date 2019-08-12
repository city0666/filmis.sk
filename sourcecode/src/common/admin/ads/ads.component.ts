import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Settings} from '../../core/config/settings.service';

@Component({
    selector: 'ads',
    templateUrl: './ads.component.html',
    styleUrls: ['./ads.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdsComponent implements OnInit {
    constructor(
        public settings: Settings,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
    }
}
