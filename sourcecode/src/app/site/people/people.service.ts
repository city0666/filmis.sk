import {Injectable} from '@angular/core';
import {BackendResponse} from '../../../common/core/types/backend-response';
import {AppHttpClient} from '../../../common/core/http/app-http-client.service';
import {Person} from '../../models/person';
import {Title} from '../../models/title';
import {PaginatedBackendResponse} from '../../../common/core/types/paginated-backend-response';
import {MetaTag} from '../../../common/core/meta/meta-tags.service';

export interface GetPersonResponse {
    person: Person;
    knownFor: Title[];
    credits: {[key: string]: Title[]};
    seo?: MetaTag[];
}

@Injectable({
    providedIn: 'root'
})
export class PeopleService {
    constructor(private http: AppHttpClient) {}

    public getAll(params: {perPage?: number, page?: number, mostPopular?: boolean}): PaginatedBackendResponse<Person> {
        return this.http.get('people', params);
    }

    public get(id: number): BackendResponse<GetPersonResponse> {
        return this.http.get('people/' + id);
    }

    public create(payload: Partial<Person>): BackendResponse<{person: Person}> {
        return this.http.post('people', payload);
    }

    public update(id: number, payload: Partial<Person>): BackendResponse<{person: Person}> {
        return this.http.put('people/' + id, payload);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.http.delete('people', {ids});
    }
}
