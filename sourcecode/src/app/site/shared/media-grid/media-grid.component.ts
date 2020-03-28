import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {Title} from '../../../models/title';
import {Person} from '../../../models/person';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {MEDIA_TYPE} from '../../media-type';

@Component({
    selector: 'media-grid',
    templateUrl: './media-grid.component.html',
    styleUrls: ['./media-grid.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaGridComponent {
    @Input() actionIcon = 'play-arrow';
    @Input() items: (Title|Person)[] = [];
    @Output() actionClick = new EventEmitter();

    constructor(
        public urls: TitleUrlsService,
    ) {}

    public isPerson(item: Title|Person) {
        return item.type !== MEDIA_TYPE.PERSON;
    }
}
