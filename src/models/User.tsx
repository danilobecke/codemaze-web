import { enumOf, objectOf, primitives } from '@altostra/type-validations'
import { BaseObject } from '../services/ApiService'
import { Role } from './Role';

export class User implements BaseObject {
    id: number;
    name: string;
    email: string;
    role: Role;
    token: string;

    constructor() {
        this.id = -1;
        this.name = '';
        this.email = '';
        this.role = 'student';
        this.token = '';
    }

    #isUser = objectOf({
        id: primitives.number,
        name: primitives.string,
        email: primitives.string,
        role: enumOf<Role>('manager', 'student'),
        token: primitives.string,
    })

    isValid(json: any): boolean {
        return this.#isUser(json);
    }
}
