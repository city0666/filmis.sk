import {Title} from './title';

export class Video {
    id: number;
    name: string;
    url: string;
    type: string;
    thumbnail?: string;
    source: 'local'|'tmdb';
    quality: string;
    title?: Title;
    positive_votes?: number;
    negative_votes?: number;
    season: number;
    episode: number;
    title_id: number;
    episode_id: number;

    constructor(params: object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
