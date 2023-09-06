export function clearInput(name: string) {
    const field = document.getElementsByName(name)[0] as HTMLInputElement
    field.value = ''
}

export function getInputValue(element_name: string, setError: (error: boolean) => void): string | null {
    const field = document.getElementsByName(element_name)[0] as HTMLInputElement
    const value = field.value.trim()
    if(!value) {
        setError(true)
        return null
    }
    setError(false)
    return value
}
