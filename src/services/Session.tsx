import { User } from "../models/User";

var Session = (function () {
    const userKey = 'current_user'

    function parseJwt(token: string): any | null {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch {
            return null;
        }
    };

    function getUser(): User | null {
        const rawUser = localStorage.getItem(userKey)
        if (!rawUser) {
            return null
        }
        const json = JSON.parse(rawUser)
        const user = new User()
        if (!user.isValid(json)) {
            logOut()
            return null
        }
        const returnValue = Object.assign(user, json)
        const jwt = parseJwt(user.token)
        if (!jwt || jwt.exp * 1000 < Date.now()) {
            logOut()
            return null
        }
        return returnValue
    }

    function setUser(user: User) {
        localStorage.setItem(userKey, JSON.stringify(user))
    };

    function logOut() {
        localStorage.removeItem(userKey)
    }

    return {
        getCurrentUser: getUser,
        logIn: setUser,
        logOut: logOut
    }
})();

export default Session;
