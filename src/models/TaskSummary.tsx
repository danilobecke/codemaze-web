import { arrayOf, objectOf, primitives } from "@altostra/type-validations";
import { BaseObject } from "../services/ApiService";

export class TaskSummary implements BaseObject {
    id: number
    name: string
    max_attempts: number | null
    languages: string[]
    starts_on: string
    ends_on: string | null
    file_url: string

    startsOn(): Date {
        return new Date(this.starts_on)
    }

    endsOn(): Date | null {
        if (this.ends_on) {
            return new Date(this.ends_on)
        }
        return null
    }

    constructor() {
        this.id = -1
        this.name = ''
        this.max_attempts = null
        this.languages = []
        this.starts_on = ''
        this.ends_on = null
        this.file_url = ''
    }

    #isTask = objectOf({
        id: primitives.number,
        name: primitives.string,
        max_attempts: primitives.maybeNumber,
        languages: arrayOf(primitives.string),
        starts_on: primitives.string,
        ends_on: primitives.maybeString,
        file_url: primitives.string,
    })

    isValid(json: any): boolean {
        return this.#isTask(json)
    }

    isClosed(now: Date | null = null): boolean {
        const endsOn = this.endsOn()
        return endsOn !== null && endsOn <= (now ?? new Date())
    }
}
