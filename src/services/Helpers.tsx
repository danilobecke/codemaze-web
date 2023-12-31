import { AnyTypeValidation, maybe } from "@altostra/type-validations"

import { getFileURL } from "./ApiService"
import { AppError } from "../models/AppError"

export function clearInput(name: string) {
    const field = document.getElementsByName(name)[0] as HTMLInputElement
    field.value = ''
}

export function getInputValue(element_name: string, setError: ((error: boolean) => void) | null = null): string | null {
    const field = document.getElementsByName(element_name)[0] as HTMLInputElement
    const value = field.value.trim()
    if (setError) {
        setError(!value)
    }
    return !value ? null : value
}

export async function downloadFile(url: string, filenameFallback: string, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true, useRemoteFilename: boolean = true) {
    const file = await getFileURL(url, setIsLoading, authenticated)
    const link = document.createElement('a')
    link.href = file.url
    link.download = useRemoteFilename ? (file.filename ?? filenameFallback) : filenameFallback
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
}

export function maybeOrNull<T>(validator: AnyTypeValidation<T>) {
    return maybe(validator, true)
}

export function zip3<T, U, V>(a: T[], b: U[], c: V[]): [T, U, V][] {
    return a.map((element, index) => [element, b[index], c[index]])
}

export class MultipleInput<T> {
    value?: T

    constructor(value?: T) {
        this.value = value
    }
}

export function setOn<T>(setFunction: (value: T[]) => void, current: T[], value: T, index: number) {
    setFunction(current.slice(0, index).concat(value).concat(current.slice(index + 1)))
}

export function addOn<T>(setFunction: (value: T[]) => void, current: T[], value: T) {
    setFunction([...current, value])
}

export function removeFrom<T>(setFunction: (value: T[]) => void, current: T[], index: number) {
    setFunction(current.slice(0, index).concat(current.slice(index + 1)))
}

export function handleError(error: unknown, setAppError: (appError: AppError) => void) {
    if (error instanceof AppError) {
        setAppError(error)
    } else if (error instanceof Error) {
        setAppError(new AppError('', error.message))
    } else {
        alert(error) // fallback
    }
}
