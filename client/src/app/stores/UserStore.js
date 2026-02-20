import { makeAutoObservable } from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        this._enrollmentId = null; // <-- добавили глобальное поле
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
    }

    setUserImage(img) {
        if (this.user) {
            this.user.img = img;
        }
    }

    setEnrollmentId(id) {
        this._enrollmentId = id;
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get enrollmentId() {
        return this._enrollmentId;
    }
}
