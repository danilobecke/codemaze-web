import { objectOf, primitives } from '@altostra/type-validations'
import { UpdatedUser } from './UpdatedUser';

export class User extends UpdatedUser {
    token: string;

    constructor() {
        super()
        this.token = ''
    }

    #isUser = objectOf({
        token: primitives.string,
    })

    isValid(json: any): boolean {
        return super.isValid(json) && this.#isUser(json);
    }
}
