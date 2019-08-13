import { Popup } from 'app/models/popup';

export class HydratePopup {
    static readonly type = '[CrupdatePopup] Hyrdate';
    constructor() {}
}

export class CreatePopup {
    static readonly type = '[CrupdatePopup] Create Popup';
    constructor(public payload: Partial<Popup>) {}
}

export class UpdatePopup {
    static readonly type = '[CrupdatePopup] Update Popup';
    constructor(public payload: Partial<Popup>) {}
}

export class DeletePopup {
    static readonly type = '[Crupdate] Delete Popup';
    constructor(public popup: Popup) {}
}

export class ChangePopupOrder {
    static readonly type = '[CrupdatePopup] Change Popups Order';
    constructor(
        public currentIndex: number,
        public newIndex: number
    ) {}
}
