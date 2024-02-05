import { enumOf, objectOf, primitives } from '@altostra/type-validations'
import { BaseObject } from '../services/ApiService'
import { Role } from './Role';

export class UpdatedUser implements BaseObject {
    id: number;
    name: string;
    email: string;
    role: Role;

    constructor() {
        this.id = -1;
        this.name = '';
        this.email = '';
        this.role = 'student';
    }

    #isUser = objectOf({
        id: primitives.number,
        name: primitives.string,
        email: primitives.string,
        role: enumOf<Role>('manager', 'student'),
    })

    isValid(json: any): boolean {
        return this.#isUser(json);
    }
}
