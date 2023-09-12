import { objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";
import { PublicUser } from "./PublicUser";

export class Group implements BaseObject {
    id: number
    name: string
    active: boolean
    code: string
    manager: PublicUser

    constructor() {
        this.id = -1
        this.name = ''
        this.active = false
        this.code = ''
        this.manager = new PublicUser()
    }

    #isGroup = objectOf({
        id: primitives.number,
        name: primitives.string,
        active: primitives.boolean,
        code: primitives.string,
        manager: PublicUser.isPublicUser,
    })

    isValid(json: any): boolean {
        return this.#isGroup(json)
    }
}