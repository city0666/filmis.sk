import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    HostBinding,
    Input,
} from '@angular/core';

@Component({
    selector: 'media-item-header',
    templateUrl: './media-item-header.component.html',
    styleUrls: ['./media-item-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaItemHeaderComponent {
    @Input() backdrop: string;
    @Input() transparent = false;

    @HostBinding('style.background-image') get backgroundImage() {
        if (this.backdrop) {
            return 'url(' + this.backdrop + ')';
        }
    }

    @HostBinding('class.no-backdrop') get noBackdrop() {
        if ( ! this.backdrop) {
            return 'no-backdrop';
        }
    }
}
