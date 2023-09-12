import Session from "./Session";

// Base URL
const base_url = 'http://127.0.0.1:8080'

// get URL
export function v1Namespace(route: string, params: {key: string, value: any}[] | null = null): string {
    return base_url + '/api/v1/' + route + (params ? '?' + params.map(param => param.key + '=' + param.value).join(',') : '')
}

// Base Object
export interface BaseObject extends Object {
    isValid(json: any): boolean
}

// Helpers
enum Method {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
};

function getJSONRequestOptions(method: Method, authenticated: boolean, body: Object | null): RequestInit {
    const requestOptions: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    if (body) {
        requestOptions.body = JSON.stringify(body)
    }
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

function getJson(response: Response): Promise<any> {
    if (response.ok) {
        return response.json()
    }
    const status = response.status
    if (status === 401) {
        Session.logOut()
    }
    throw new Error(status + ' - ' + response.statusText)
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
            for(const group of json[key]) {
                result.push(parse(group, objectType))
            }
            return result
        })
        .finally(() => setIsLoading(false))
}

export async function get<T extends BaseObject>(endpoint: string, objectType: new () => T, setIsLoading: (isLoading: boolean) => void, authenticated: boolean = true): Promise<T> {
    return _fetch(endpoint, Method.GET, null, objectType, setIsLoading, authenticated)
}
