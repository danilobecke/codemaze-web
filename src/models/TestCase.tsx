import { objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";

export default class TestCase implements BaseObject {
    id: number
    closed: boolean
    input_url?: string
    output_url?: string

    constructor() {
        this.id = -1
        this.closed = false
    }

    static isTestCase = objectOf({
        id: primitives.number,
        closed: primitives.boolean,
        input_url: primitives.maybeString,
        output_url: primitives.maybeString
    })

    isValid(json: any): boolean {
        return TestCase.isTestCase(json)
    }
}
