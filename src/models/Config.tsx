import { arrayOf, objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";

export class Config implements BaseObject {
    create_test_script_url: string
    configs: LanguageConfig[]

    constructor() {
        this.create_test_script_url = ""
        this.configs = []
    }

    #isConfig = objectOf({
        create_test_script_url: primitives.string,
        configs: arrayOf(LanguageConfig.isConfig)
    })

    isValid(json: any): boolean {
        return this.#isConfig(json)
    }
}

export class LanguageConfig implements BaseObject {
    language_name: string
    supported_extensions: string[]
    help: string

    constructor() {
        this.language_name = ''
        this.supported_extensions = []
        this.help = ''
    }

    static isConfig = objectOf({
        language_name: primitives.string,
        supported_extensions: arrayOf(primitives.string),
        help: primitives.string
    })

    isValid(json: any): boolean {
        return LanguageConfig.isConfig(json)
    }
}
