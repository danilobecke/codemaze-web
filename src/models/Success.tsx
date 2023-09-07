import { objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";

class Success implements BaseObject {
    message: string

    constructor() {
        this.message = ''
    }

    #isSuccess = objectOf({
        message: primitives.string,
    })

    isValid(json: any): boolean {
        return this.#isSuccess(json)
    }
}

export default Success;
