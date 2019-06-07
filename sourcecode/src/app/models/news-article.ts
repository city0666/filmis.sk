export class NewsArticle {
    id: number;
    title?: string;
    body: string;
    slug: string;
    type = 'news_article';
    created_at?: string;
    updated_at?: string;
    meta: {
        image: string,
        source: string,
    };

    constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}