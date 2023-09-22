import { arrayOf, objectOf } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";
import TestCase from "./TestCase";

export class AllTests implements BaseObject {
    open_tests: TestCase[]
    closed_tests: TestCase[]

    constructor() {
        this.open_tests = []
        this.closed_tests = []
    }

    #isAllTests = objectOf({
        open_tests: arrayOf(TestCase.isTestCase),
        closed_tests: arrayOf(TestCase.isTestCase),
    })

    isValid(json: any): boolean {
        return this.#isAllTests(json)
    }
}
