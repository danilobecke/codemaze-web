import Session from "./Session";

// Base URL
const base_url = 'http://127.0.0.1:48345'

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
    if (status == 401) {
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
export async function post<T extends BaseObject>(endpoint: string, body: Object, objectType: new () => T, authenticated: boolean = true): Promise<T> {
    return fetch(endpoint, getJSONRequestOptions(Method.POST, authenticated, body))
        .then(response => getJson(response))
        .then(data => parse(data, objectType))
}

export async function getArray<T extends BaseObject>(endpoint: string, key: string, objectType: new () => T, authenticated: boolean = true): Promise<T[]> {
    return fetch(endpoint, getJSONRequestOptions(Method.GET, authenticated, null))
        .then(response => getJson(response))
        .then((json) => {
            let result: T[] = []
            for(const group of json[key]) {
                result.push(parse(group, objectType))
            }
            return result
        })
}
