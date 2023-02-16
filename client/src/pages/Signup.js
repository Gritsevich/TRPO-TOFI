import { AppContext } from '../components/AppContext.js'
import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Card, Form, Button } from 'react-bootstrap'
import { signup } from '../http/userAPI.js'
import { observer } from 'mobx-react-lite'

const Signup = observer(() => {
    const { user } = useContext(AppContext)
    const navigate = useNavigate()

    const [value, setValue] = useState({email: '', password: '', confirmPassword: ''})
    const [valid, setValid] = useState({email: null, password: null, confirmPassword: null})
    
    useEffect(() => {
        if (user.isAdmin) navigate('/admin', {replace: true})
        if (user.isAuth) navigate('/user', {replace: true})
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()

        setValue({
            email: event.target.email.value.trim(),
            password: event.target.password.value.trim(),
            confirmPassword: event.target.confirmPassword.value.trim(),
        })

        setValid({
            email: isValid(event.target.email),
            password: isValid(event.target.password),
            confirmPassword: isValid(event.target.confirmPassword),
        })

        if (!valid.email || !valid.password || !valid.confirmPassword) {
            return
        }


        const email = event.target.email.value.trim()
        const password = event.target.password.value.trim()



        const data = await signup(email, password)
        if (data) {
            user.login(data)
            if (user.isAdmin) navigate('/admin')
            if (user.isAuth) navigate('/user')
        }
    }

    const isValid = (input) => {
        let pattern
        switch (input.name) {
            case 'email':
                pattern = /^[-_.a-z]+@([-a-z]+\.){1,2}[a-z]+$/i
                return pattern.test(input.value.trim())
            case 'password':
                pattern = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g
                return pattern.test(input.value.trim())
            case 'confirmPassword':
                return input.value.trim() === value.password.trim()
        }
    }

    const handleChange = (e) => {
        setValue({...value, [e.target.name]: e.target.value})
        
        setValid({...valid, [e.target.name]: isValid(e.target)})
    }


    return (
        <Container className="d-flex justify-content-center">
            <Card style={{width: '50%'}} className="p-2 mt-5 bg-light">
                <h3 className="m-auto">Регистрация</h3>
                <Form className="d-flex flex-column" onSubmit={handleSubmit}>
                    <Form.Control
                        name="email"
                        className="mt-3"
                        value={value.email}
                        onChange={e => handleChange(e)}
                        isValid={valid.email === true}
                        isInvalid={valid.email === false}
                        placeholder="Введите ваш email..."
                    />
                    <Form.Control
                        name="password"
                        className="mt-3"
                        value={value.password}
                        onChange={e => handleChange(e)}
                        isValid={valid.password === true}
                        isInvalid={valid.password === false}
                        placeholder="Введите ваш пароль..."
                    />
                    <Form.Control
                        name="confirmPassword"
                        className="mt-3"
                        value={value.confirmPassword}
                        onChange={e => handleChange(e)}
                        isValid={valid.confirmPassword === true}
                        isInvalid={valid.confirmPassword === false}
                        placeholder="Повторите ваш пароль..."
                    />
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3 p-2">
                        <Button type="submit">
                            Регистрация
                        </Button>
                        <p>
                            Уже есть аккаунт?&nbsp;
                            <Link to="/login">Войдите!</Link>
                        </p>
                    </Row>
                </Form>
            </Card>
        </Container>
    )
})

export default Signup
