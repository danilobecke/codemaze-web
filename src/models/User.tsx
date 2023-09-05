import { objectOf, primitives } from '@altostra/type-validations'
import { BaseObject } from '../services/ApiService'

export class User implements BaseObject {
    id: number;
    name: string;
    email: string;
    role: string;
    token: string;

    constructor() {
        this.id = -1;
        this.name = '';
        this.email = '';
        this.role = '';
        this.token = '';
    }

    #isUser = objectOf({
        id: primitives.number,
        name: primitives.string,
        email: primitives.string,
        role: primitives.string,
        token: primitives.string,
    })

    isValid(json: any): boolean {
        return this.#isUser(json);
    }
}
