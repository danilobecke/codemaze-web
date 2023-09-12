import { objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";

export class JoinRequest implements BaseObject {
    id: number
    student: string

    constructor() {
        this.id = -1
        this.student = ''
    }

    #isJoinRequest = objectOf({
        id: primitives.number,
        student: primitives.string,
    })

    isValid(json: any): boolean {
        return this.#isJoinRequest(json)
    }
}
