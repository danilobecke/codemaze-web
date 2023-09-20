import { arrayOf, objectOf } from "@altostra/type-validations";
import { TaskSummary } from "./TaskSummary";
import TestCase from "./TestCase";

export default class Task extends TaskSummary {
    open_tests: TestCase[]
    closed_tests: TestCase[]

    constructor() {
        super()
        this.open_tests = []
        this.closed_tests = []
    }

    #hasTests = objectOf({
        open_tests: arrayOf(TestCase.isTestCase),
        closed_tests: arrayOf(TestCase.isTestCase)
    })

    isValid(json: any): boolean {
        return super.isValid(json) && this.#hasTests(json)
    }
}
