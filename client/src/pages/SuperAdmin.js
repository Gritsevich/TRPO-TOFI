import { Container, Button } from 'react-bootstrap'
import { useContext } from 'react'
import { AppContext } from '../components/AppContext.js'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../http/userAPI.js'

const SuperAdmin = () => {
    const { user } = useContext(AppContext)
    const navigate = useNavigate()

    const handleLogout = (event) => {
        logout()
        user.logout()
        navigate('/login', {replace: true})
    }

    return (
        <Container>
            <h1>Панель управления</h1>
            <p>
                Это панель управления магазином для супер администратора
            </p>
            <ul>
                <li><Link to="/superadmin/users">Пользователи</Link></li>
            </ul>
            <Button onClick={handleLogout}>Выйти</Button>
        </Container>
    )
}

export default SuperAdmin