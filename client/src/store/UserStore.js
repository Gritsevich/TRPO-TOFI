import { makeAutoObservable } from 'mobx'

class UserStore {
    id = null
    email = null
    isAuth = false
    isAdmin = false
    isSuperAdmin = false

    constructor() {
        makeAutoObservable(this)
    }

    login({id, email, role}) {
        this.id = id
        this.email = email
        this.isAuth = true
        this.isAdmin = role === 'ADMIN'
        this.isSuperAdmin = role === 'SUPERADMIN'
    }

    logout() {
        this.id = null
        this.email = null
        this.isAuth = false
        this.isAdmin = false
        this.isSuperAdmin = false
    }
}

export default UserStore