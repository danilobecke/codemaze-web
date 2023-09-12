import { objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";

export class PublicUser implements BaseObject {
    name: string
    email: string

    constructor() {
        this.name = ''
        this.email = ''
    }

    static isPublicUser = objectOf({
        name: primitives.string,
        email: primitives.string,
    })

    isValid(json: any): boolean {
        return PublicUser.isPublicUser(json)
    }
}
