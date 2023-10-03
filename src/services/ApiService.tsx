import Session from "./Session";

// Base URL
const base_url = 'http://127.0.0.1:8080'

// get URL
export function v1Namespace(route: string, params: { key: string, value: any }[] | null = null): string {
    return base_url + '/api/v1/' + route + (params ? '?' + params.map(param => param.key + '=' + param.value).join('&') : '')
}

// BaseObject
export interface BaseObject extends Object {
    isValid(json: any): boolean
}

// File
export class File {
    filename?: string
    url: string

    constructor(url: string, filename?: string) {
        this.filename = filename
        this.url = url
    }
}

// Helpers
enum Method {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
};

function getJSONRequestOptions(method: Method, authenticated: boolean, body: Object | null): RequestInit {
    const options = getRequestOptions(method, authenticated, { 'Content-Type': 'application/json' })
    if (body) {
        options.body = JSON.stringify(body, jsonReplacer)
    }
    return options
}

function getRequestOptions(method: Method, authenticated: boolean, headers?: HeadersInit): RequestInit {
    const requestOptions: RequestInit = {
        method: method,
        headers: headers
    };
    if (authenticated) {
        const user = Session.getCurrentUser()
        if (!user) {
            throw Error('Sign in before proceeding with this request.')
        }
        requestOptions.headers = {
            ...requestOptions.headers,
            'Authorization': 'Bearer ' + user.token
        };
    }
    return requestOptions
}

function getFormDataRequestOptions(method: Method, authenticated: boolean, body: FormData): RequestInit {
    const options = getRequestOptions(method, authenticated)
    options.body = body
    return options
}

function jsonReplacer(key: string, value: any) {
    // Filtering null properties
    if (value === null) {
        return undefined;
    }
    return value;
}

function getJson(response: Response): Promise<any> {
    return assertResponse(response).json()
}

function assertResponse(response: Response): Response {
    if (response.ok) {
        return response
    }
    const status = response.status
    if (status === 401) {
        Session.logOut()
    }
    throw new Error(status + ' - ' + response.statusText)
}

function getFile(response: Response): Promise<File> {
    const validResponse = assertResponse(response)
    const filename = response.headers.get('Content-Disposition')?.match(/filename=(.*)/)?.at(1)
    return validResponse.blob()
        .then(blob => new File(window.URL.createObjectURL(blob), filename))
}

function parse<T extends BaseObject>(data: any, objectType: new () => T): T {
    const newObject = new objectType()
    if (!newObject.isValid(data)) {
        throw new Error('Unable to parse "' + newObject.constructor.name + '" from:\n' + JSON.stringify(data))
    }
    return Object.assign(newObject, data)
}

// Methods
async function _fetch<T extends BaseObject>(endpoint: string, method: Method, body: Object | null, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean): Promise<T> {
    setIsLoading(true)
    return fetch(endpoint, getJSONRequestOptions(method, authenticated, body))
        .then(response => getJson(response))
        .then(data => parse(data, objectType))
        .finally(() => setIsLoading(false))
}

export async function post<T extends BaseObject>(endpoint: string, body: Object, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<T> {
    return _fetch(endpoint, Method.POST, body, objectType, setIsLoading, authenticated)
}

export async function getArray<T extends BaseObject>(endpoint: string, key: string, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<T[]> {
    setIsLoading(true)
    return fetch(endpoint, getJSONRequestOptions(Method.GET, authenticated, null))
        .then(response => getJson(response))
        .then((json) => {
            let result: T[] = []
            for (const group of json[key]) {
                result.push(parse(group, objectType))
            }
            return result
        })
        .finally(() => setIsLoading(false))
}

export async function get<T extends BaseObject>(endpoint: string, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<T> {
    return _fetch(endpoint, Method.GET, null, objectType, setIsLoading, authenticated)
}

export async function patch<T extends BaseObject>(endpoint: string, body: Object, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<T> {
    return _fetch(endpoint, Method.PATCH, body, objectType, setIsLoading, authenticated)
}

export async function remove<T extends BaseObject>(endpoint: string, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<T> {
    return _fetch(endpoint, Method.DELETE, null, objectType, setIsLoading, authenticated)
}

export async function getFileURL(path: string, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<File> {
    const url = base_url + path
    setIsLoading(true)
    return fetch(url, getRequestOptions(Method.GET, authenticated))
        .then(response => getFile(response))
        .finally(() => setIsLoading(false))
}

async function _executeFormData<T extends BaseObject>(endpoint: string, method: Method, data: FormData, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<T> {
    setIsLoading(true)
    return fetch(endpoint, getFormDataRequestOptions(method, authenticated, data))
        .then(response => getJson(response))
        .then(data => parse(data, objectType))
        .finally(() => setIsLoading(false))
}

export async function sendFormData<T extends BaseObject>(endpoint: string, data: FormData, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<T> {
    return _executeFormData(endpoint, Method.POST, data, objectType, setIsLoading, authenticated)
}

export async function patchFormData<T extends BaseObject>(endpoint: string, data: FormData, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<T> {
    return _executeFormData(endpoint, Method.PATCH, data, objectType, setIsLoading, authenticated)
}
