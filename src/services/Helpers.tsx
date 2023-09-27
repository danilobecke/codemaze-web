import { AnyTypeValidation, maybe } from "@altostra/type-validations"

import { getFileURL } from "./ApiService"

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

export async function downloadFile(url: string, filenameFallback: string, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true) {
    const file = await getFileURL(url, setIsLoading, authenticated)
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.filename ?? filenameFallback
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
}

export function maybeOrNull<T>(validator: AnyTypeValidation<T>) {
    return maybe(validator, true)
}
