import {Injectable} from '@angular/core';
import {AppHttpClient} from '../../../common/core/http/app-http-client.service';
import {BackendResponse} from '../../../common/core/types/backend-response';
import {Video} from '../../models/video';

@Injectable({
    providedIn: 'root'
})
export class VideoService {
    constructor(private http: AppHttpClient) {}

    public create(payload: Partial<Video>): BackendResponse<{video: Video}> {
        return this.http.post('videos', payload);
    }

    public update(id: number, payload: Partial<Video>): BackendResponse<{video: Video}> {
        return this.http.put('videos/' + id, payload);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.http.delete('videos', {ids});
    }

    public rate(id: number, rating: 'positive' | 'negative'): BackendResponse<{video: Video}> {
        return this.http.post('videos/' + id + '/rate', {rating});
    }
}
