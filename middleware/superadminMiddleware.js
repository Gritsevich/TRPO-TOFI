import AppError from '../errors/AppError.js'

const superadmin = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {
        if (req.auth.role !== 'SUPERADMIN') {
            throw new Error('Только для супер администратора')
        }
        next()
    } catch (e) {
        next(AppError.forbidden(e.message))
    }
}

export default superadmin