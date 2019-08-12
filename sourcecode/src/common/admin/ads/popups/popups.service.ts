import {Injectable} from '@angular/core';
import {AppHttpClient} from '../../../core/http/app-http-client.service';
import {BackendResponse} from '../../../core/types/backend-response';
import {Popup} from '../../../../app/models/popup';

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    constructor(private http: AppHttpClient) {}

    public get(popupId: number): BackendResponse<{popup: Popup}> {
        return this.http.get('popups/' + popupId);
    }

    public create(payload: Partial<Popup>): BackendResponse<{popup: Popup}> {
        return this.http.post('popups', payload);
    }

    public update(id: number, payload: Partial<Popup>): BackendResponse<{popup: Popup}> {
        return this.http.put('popups/' + id, payload);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.http.delete('popups', {ids});
    }
}