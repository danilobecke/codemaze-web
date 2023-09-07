import { objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";

export class Group implements BaseObject {
    id: number
    name: string
    active: boolean
    code: string

    constructor() {
        this.id = -1
        this.name = ''
        this.active = false
        this.code = ''
    }

    #isGroup = objectOf({
        id: primitives.number,
        name: primitives.string,
        active: primitives.boolean,
        code: primitives.string,
    })

    isValid(json: any): boolean {
        return this.#isGroup(json)
    }
}