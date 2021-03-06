import {Component, ViewEncapsulation} from '@angular/core';
import { Settings } from '../../common/core/config/settings.service';
import { CurrentUser } from '../../common/auth/current-user';
import { BreakpointsService } from '../../common/core/ui/breakpoints.service';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdminComponent {
    public leftColumnIsHidden = false;

    constructor(
        public settings: Settings,
        public currentUser: CurrentUser,
        public breakpoints: BreakpointsService
    ) {}

    public toggleLeftSidebar() {
        this.leftColumnIsHidden = !this.leftColumnIsHidden;
    }

    public getCustomSidebarItems() {
        return this.settings.get('vebto.admin.pages');
    }
}
