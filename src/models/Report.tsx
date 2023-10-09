import { arrayOf, objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";
import { maybeOrNull } from "../services/Helpers";

export class Report implements BaseObject {
    overall: OverallReport
    students: StudentReport[]
    tests: TestReport[]

    constructor() {
        this.overall = new OverallReport()
        this.students = []
        this.tests = []
    }

    #isReport = objectOf({
        overall: OverallReport.isOverallReport,
        students: arrayOf(StudentReport.isStudentReport),
        tests: arrayOf(TestReport.isTestReport)
    })

    isValid(json: any): boolean {
        return this.#isReport(json)
    }
}

export class ResultPercentage implements BaseObject {
    result_percentage: number
    students_percentage: number

    constructor() {
        this.result_percentage = -1
        this.students_percentage = -1
    }

    static isResultPercentage = objectOf({
        result_percentage: primitives.number,
        students_percentage: primitives.number
    })

    isValid(json: any): boolean {
        return ResultPercentage.isResultPercentage(json)
    }
}

export class OverallReport implements BaseObject {
    submissions_percentage: number
    mean_attempts_success_all: number | null
    tests_more_failures: number[]
    plagiarism_report_urls: string[]
    results_percentages: ResultPercentage[]

    constructor() {
        this.submissions_percentage = -1
        this.mean_attempts_success_all = null
        this.tests_more_failures = []
        this.plagiarism_report_urls = []
        this.results_percentages = []
    }

    static isOverallReport = objectOf({
        submissions_percentage: primitives.number,
        mean_attempts_success_all: maybeOrNull(primitives.number),
        tests_more_failures: arrayOf(primitives.number),
        plagiarism_report_urls: arrayOf(primitives.string),
        results_percentages: arrayOf(ResultPercentage.isResultPercentage)
    })

    isValid(json: any): boolean {
        return OverallReport.isOverallReport(json)
    }
}

export class StudentReport implements BaseObject {
    name: string
    open_result_percentage: number
    closed_result_percentage: number | null
    result_percentage: number
    number_attempts: number
    source_code_url: string | null
    wrong_tests_id: number[]

    constructor() {
        this.name = ''
        this.open_result_percentage = -1
        this.closed_result_percentage = null
        this.result_percentage = -1
        this.number_attempts = -1
        this.source_code_url = null
        this.wrong_tests_id = []
    }

    static isStudentReport = objectOf({
        name: primitives.string,
        open_result_percentage: primitives.number,
        closed_result_percentage: maybeOrNull(primitives.number),
        result_percentage: primitives.number,
        number_attempts: primitives.number,
        source_code_url: maybeOrNull(primitives.string),
        wrong_tests_id: arrayOf(primitives.number),
    })

    isValid(json: any): boolean {
        return StudentReport.isStudentReport(json)
    }
}

export class TestReport implements BaseObject {
    id: number
    correct_percentage: number

    constructor() {
        this.id = -1
        this.correct_percentage = -1
    }

    static isTestReport = objectOf({
        id: primitives.number,
        correct_percentage: primitives.number
    })

    isValid(json: any): boolean {
        return TestReport.isTestReport(json)
    }
}
