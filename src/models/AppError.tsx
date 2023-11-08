export class AppError extends Error {
    title: string

    constructor(title: string, message: string) {
        super(message)
        this.title = title
    }
}
