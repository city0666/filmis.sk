import {Injectable} from '@angular/core';
import {AppHttpClient} from '../../../common/core/http/app-http-client.service';
import {List} from '../../models/list';
import {MEDIA_TYPE} from '../media-type';
import {BackendResponse} from '../../../common/core/types/backend-response';
import {ListItem} from './types/list-item';
import {PaginationResponse} from '../../../common/core/types/pagination-response';
import {ListQueryParams} from './types/list-query-params';
import {PaginatedBackendResponse} from '../../../common/core/types/paginated-backend-response';

interface CrupdateListPayload {
    details: Partial<List>;
    items: { id: number, type: MEDIA_TYPE }[];
}

interface ListIndexParams {
    userId?: number;
    query?: string;
    listIds?: number[];
    excludeSystem?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ListsService {
    constructor(private http: AppHttpClient) {}

    public get(id: number, params: ListQueryParams): BackendResponse<{list: List, items: PaginationResponse<ListItem>}> {
        return this.http.get('lists/' + id, params);
    }

    public getAll(params: ListIndexParams): PaginatedBackendResponse<List> {
        return this.http.get('lists', params);
    }

    public update(id: number, payload: CrupdateListPayload): BackendResponse<{list: List}> {
        return this.http.put('lists/' + id, payload);
    }

    public create(payload: CrupdateListPayload): BackendResponse<{list: List}> {
        return this.http.post('lists', payload);
    }

    public addItem(listId: number, mediaItem: ListItem): BackendResponse<{list: List}> {
        return this.http.post('lists/' + listId + '/add', {itemId: mediaItem.id, itemType: mediaItem.type});
    }

    public removeItem(listId: number, mediaItem: ListItem): BackendResponse<{list: List}> {
        return this.http.post('lists/' + listId + '/remove', {itemId: mediaItem.id, itemType: mediaItem.type});
    }

    public reorder(listId: number, itemIds: {[key: number]: number}) {
        return this.http.post('lists/' + listId + '/reorder', {itemIds});
    }

    public delete(listIds: number[]) {
        return this.http.delete('lists', {listIds});
    }
}
