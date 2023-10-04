import { arrayOf, objectOf, primitives } from "@altostra/type-validations";

import { BaseObject } from "../services/ApiService";
import { maybeOrNull } from "../services/Helpers";

export class Result implements BaseObject {
    attempt_number: number
    open_result_percentage: number
    closed_result_percentage: number | null
    result_percentage: number
    source_url: string
    open_results: TestCaseResult[]
    closed_results: TestCaseResult[]

    constructor() {
        this.attempt_number = 0
        this.open_result_percentage = 0
        this.closed_result_percentage = 0
        this.result_percentage = 0
        this.source_url = ''
        this.open_results = []
        this.closed_results = []
    }

    #isResult = objectOf({
        attempt_number: primitives.number,
        open_result_percentage: primitives.number,
        closed_result_percentage: maybeOrNull(primitives.number),
        result_percentage: primitives.number,
        source_url: primitives.string,
        open_results: arrayOf(TestCaseResult.isTestCase),
        closed_results: arrayOf(TestCaseResult.isTestCase),
    })

    isValid(json: any): boolean {
        return this.#isResult(json)
    }
}

export class TestCaseResult implements BaseObject {
    success: boolean
    diff: string | null

    constructor() {
        this.success = false
        this.diff = null
    }

    static isTestCase = objectOf({
        success: primitives.boolean,
        diff: maybeOrNull(primitives.string)
    })

    isValid(json: any): boolean {
        return TestCaseResult.isTestCase(json)
    }
}
