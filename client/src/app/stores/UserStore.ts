import { makeAutoObservable, runInAction } from "mobx";
import type { ProgramProgress } from "../entities/progress/model/type";

interface User {
    id: number;
    name?: string;
    email?: string;
    img?: string;
    // другие поля пользователя
}

export default class UserStore {
    private _isAuth: boolean = false;
    private _user: User | {} = {};
    private _enrollmentId: number | null = null;
    private _enrollmentProgress: Record<number, ProgramProgress> = {}; // ключ = enrollmentId
    private _progressChanges = [];

    constructor() {
        makeAutoObservable(this);
    }

    // -----------------------------
    // Пользователь и авторизация
    // -----------------------------
    setIsAuth(value: boolean) {
        this._isAuth = value;
    }

    setUser(user: User) {
        this._user = user;
    }

    setUserImage(img: string) {
        if ("img" in this._user) {
            this._user.img = img;
        }
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user as User;
    }

    // -----------------------------
    // Enrollment
    // -----------------------------
    setEnrollmentId(id: number) {
        this._enrollmentId = id;
    }

    get enrollmentId() {
        return this._enrollmentId;
    }

    // -----------------------------
    // Прогресс пользователя
    // -----------------------------
    // Получаем прогресс по enrollmentId
    getEnrollmentProgress(enrollmentId: number): ProgramProgress | null {
        return this._enrollmentProgress[enrollmentId] || null;
    }

    // Устанавливаем/обновляем прогресс
    setEnrollmentProgress(enrollmentId: number, progress: ProgramProgress) {
        this._enrollmentProgress[enrollmentId] = progress;
    }

    // { enrollmentId: string[] }
    setProgressChanges(enrollmentId, changedKeys) {
        this._progressChanges[enrollmentId] = changedKeys;
    }
    getProgressChanges(enrollmentId) {
        return this._progressChanges[enrollmentId] || [];
    }
    clearProgressChanges(enrollmentId) {
        this._progressChanges[enrollmentId] = [];
    }

    // Частичное обновление прогресса (например, один файл/тест)
    updateContentProgress(
        enrollmentId: number,
        contentKey: string, // формат: file-123, test-456
        contentProgress: any // объект UserContentProgress
    ) {
        const prog = this._enrollmentProgress[enrollmentId];
        if (!prog) return;

        runInAction(() => {
            prog.byContent = {
                ...prog.byContent,
                [contentKey]: contentProgress
            };

            // Пересчёт процента
            const totalItems = Object.keys(prog.byContent).length;
            const completedItems = Object.values(prog.byContent).filter(
                (item: any) => item.status === "completed"
            ).length;

            prog.percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            this._enrollmentProgress[enrollmentId] = { ...prog };
        });
    }
}
