export class Popup {
    id: number;
    name: string;
    url: string;
    thumbnail?: string;
    views?: number;

    constructor(params: object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
