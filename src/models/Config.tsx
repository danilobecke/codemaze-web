import { arrayOf, objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";

export class Config implements BaseObject {
    language_name: string
    supported_extensions: string[]
    help: string

    constructor() {
        this.language_name = ''
        this.supported_extensions = []
        this.help = ''
    }

    #isConfig = objectOf({
        language_name: primitives.string,
        supported_extensions: arrayOf(primitives.string),
        help: primitives.string
    })

    isValid(json: any): boolean {
        return this.#isConfig(json)
    }
}
