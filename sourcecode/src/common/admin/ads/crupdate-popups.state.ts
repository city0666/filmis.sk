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
    DeletePopup,
    ChangePopupOrder
} from './crupdate-popups.actions';
import { moveItemInArray } from '@angular/cdk/drag-drop';
interface CrupdatePopupStateModel {
    popups: Popup[];
    loading: boolean;
}

@State<CrupdatePopupStateModel>({
    name: 'crupdatePopup',
    defaults: {
        popups: [],
        loading: false
    }
})
export class CrupdatePopupState {
    @Selector()
    static popups(state: CrupdatePopupStateModel) {
        return state.popups;
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
        return this.popups.get().pipe(tap(response => {
            console.log(action, response);
            ctx.patchState({
                popups: response.popups,
                loading: false
            })
        }))
    }
    
    @Action(CreatePopup)
    createPopup(ctx: StateContext<CrupdatePopupStateModel>, action: CreatePopup) {
        ctx.patchState({ loading: true });
        return this.popups.create(action.payload).pipe(tap(response => {
            console.log(response.popup);
            const popups = [
                response.popup,
                ...ctx.getState().popups.slice()
            ];
            console.log(popups);
            ctx.patchState({ popups });
            this.toast.open('Popup created.');
        }), finalize(() => ctx.patchState({loading: false})));
    }

    @Action(UpdatePopup)
    crupdatePopup(ctx: StateContext<CrupdatePopupStateModel>, action: UpdatePopup) {
        ctx.patchState({loading: true});
        return this.popups.update(action.id, action.payload).pipe(tap(response => {
            const popups = ctx.getState().popups.slice();
            const i = popups.findIndex(v => v.id === action.id);
            popups[i] = response.popup;
            ctx.patchState({ popups });
            this.toast.open('Popup updated.');
        }, () => {
            this.toast.open('Popup update failed.');
        }), finalize(() => ctx.patchState({loading: false})));
    }

    @Action(ChangePopupOrder)
    changePopupsOrder(ctx: StateContext<CrupdatePopupStateModel>, action: ChangePopupOrder) {
        const popups = ctx.getState().popups.slice();
        moveItemInArray(popups, action.currentIndex, action.newIndex);
        ctx.patchState({ popups });

        const order = {};
        popups.forEach((popup, i) => order[i] = popup.id);

        ctx.patchState({loading: true});
        return this.popups.changePopupsOrder(order).pipe(
            finalize(() => ctx.patchState({loading: false}))
        );
    }

    @Action(DeletePopup)
    deletePopup(ctx: StateContext<CrupdatePopupStateModel>, action: DeletePopup) {
        ctx.patchState({loading: true});

        return this.popups.delete([action.id]).pipe(
            tap(() => {
                const popups = ctx.getState().popups.slice();
                const i = popups.findIndex(v => v.id === action.id);
                popups.splice(i, 1);
                ctx.patchState({ popups });
            }),
            finalize(() => ctx.patchState({ loading: false }))
        );
    }
}