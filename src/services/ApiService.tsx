// Base URL
const base_url = 'http://127.0.0.1:48345'

// get URL
export function v1Namespace(route: string): string {
    return base_url + '/api/v1/' + route
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

function getJSONRequestOptions(method: Method, authenticated: boolean, body?: Object): RequestInit {
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
        requestOptions.headers = {
            ...requestOptions.headers,
            'Authorization': 'Bearer ' + 'TODO'
        };
    }
    return requestOptions
}

function getJson(response: Response): Promise<any> {
    if (response.ok) {
        return response.json()
    }
    throw new Error(response.status + ' - ' + response.statusText)
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
