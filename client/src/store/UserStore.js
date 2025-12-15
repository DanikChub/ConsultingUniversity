import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }
    setUserImage(img) {
        if (this.user) {
            this.user.img = img;
        }
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }
}