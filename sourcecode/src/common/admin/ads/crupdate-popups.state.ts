import { Popup } from "app/models/popup";
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import {finalize, tap} from 'rxjs/operators';
import { PopupService } from './popups/popups.service';
import { Toast } from 'common/core/ui/toast.service';
import {
    HydratePopup,
    CreatePopup,
    UpdatePopup,
    DeletePopup
} from './crupdate-popups.actions';
interface CrupdatePopupStateModel {
    popup: Popup;
    loading: boolean;
}

@State<CrupdatePopupStateModel>({
    name: 'crupdatePopup',
    defaults: {
        popup: new Popup(),
        loading: false
    }
})
export class CrupdatePopupState {
    @Selector()
    static popup(state: CrupdatePopupStateModel) {
        return state.popup;
    }

    @Selector()
    static loading(state: CrupdatePopupStateModel) {
        return state.loading;
    }

    constructor(
        private router: Router,
        private store: Store,
        private popups: PopupService,
        private toast: Toast
    ) {}

    @Action(HydratePopup)
    hydratePopup(ctx: StateContext<CrupdatePopupStateModel>, action: HydratePopup) {
        ctx.patchState({ loading: true });
        return this.popups.get(action.id).pipe(tap(response => {
            ctx.patchState({
                popup: response.popup,
                loading: false
            })
        }))
    }
    
    @Action(CreatePopup)
    createPopup(ctx: StateContext<CrupdatePopupStateModel>, action: CreatePopup) {
        ctx.patchState({ loading: true });
        return this.popups.create(action.payload).pipe(tap(response => {
            this.toast.open('Popup created.');
        }), finalize(() => ctx.patchState({loading: false})));
    }

    @Action(UpdatePopup)
    crupdatePopup(ctx: StateContext<CrupdatePopupStateModel>, action: UpdatePopup) {
        ctx.patchState({loading: true});
        return this.popups.update(ctx.getState().popup.id, action.payload).pipe(tap(() => {
            this.toast.open('Popup updated.');
        }, () => {
            this.toast.open('Popup update failed.');
        }), finalize(() => ctx.patchState({loading: false})));
    }
}