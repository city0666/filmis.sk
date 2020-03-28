import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {Translations} from '../../../common/core/translations/translations.service';

const MORE_TEXT = 'more';
const LESS_TEXT = 'less';
const SUFFIX = '...';

@Directive({
    selector: '[moreLessText]'
})
export class MoreLessTextDirective implements AfterViewInit {
    @Input('moreLessText') limit = 100;

    private expanded = false;
    private shortenedContent: string;
    private originalContent: string;
    private button: HTMLButtonElement;
    private textContainer: HTMLSpanElement;
    private moreText: string;
    private lessText: string;

    constructor(
        private el: ElementRef<HTMLElement>,
        private i18n: Translations,
    ) {}

    ngAfterViewInit(): void {
        this.originalContent = this.el.nativeElement.textContent;
        const limit = +this.limit;

        if (this.originalContent.length <= limit) return;

        this.moreText = this.i18n.t(MORE_TEXT);
        this.lessText = this.i18n.t(LESS_TEXT);

        this.shortenedContent = this.originalContent.slice(0, limit - SUFFIX.length) + SUFFIX;
        this.el.nativeElement.textContent = '';

        this.createTextContainer();
        this.createButton();
    }

    private onButtonClick() {
        if (this.expanded) {
            this.textContainer.textContent = this.shortenedContent;
            this.button.textContent = this.moreText;
            this.expanded = false;
        } else {
            this.textContainer.textContent = this.originalContent;
            this.button.textContent = this.lessText;
            this.expanded = true;
        }
    }

    private createTextContainer() {
        this.textContainer = document.createElement('span');
        this.textContainer.textContent = this.shortenedContent;
        this.el.nativeElement.appendChild(this.textContainer);
    }

    private createButton() {
        this.button = document.createElement('button');
        this.button.classList.add('no-style', 'more-less-button');
        this.button.textContent = this.moreText;
        this.button.addEventListener('click', () => this.onButtonClick());
        this.el.nativeElement.appendChild(this.button);
    }
}
