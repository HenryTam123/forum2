import React, { useState, useEffect } from 'react'
import Posts from './Posts/Posts'
import axios from './axios'
import './css/style.css'
import Sidebar from './Sidebar'
import Form from './Form'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import PostsDetail from './PostsDetail'
import Profile from './Profile'
import { BrowserRouter as Router, Switch, Route, useHistory, useLocation } from 'react-router-dom'
//import { HashRouter as Router, Switch, Route } from 'react-router-dom'

const App = () => {
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [currentCategory, setCurrentCategory] = useState('Gaming')
    const [currentUser, setCurrentUser] = useState([])
    const [users, setUsers] = useState([])
    const [formVisible, setFormVisible] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [isLogging, setIsLogging] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [err, setError] = useState('')

    const getUsers = async () => {
        const res = await axios.get('/users', { withCredentials: true })
        console.log(res.data)
        setUsers(res.data)
    }
    useEffect(async () => {
        if (localStorage.getItem('username') && localStorage.getItem('password') && !isLoggedIn) {
            login(localStorage.getItem('username'), localStorage.getItem('password'))
        }
        getPost()
        getCategory()
        getUsers()

    }, [isUpdate])

    const getPost = async () => {
        const res = await axios.get('/posts')
        const posts = res.data
        setPosts(posts)
        console.log(posts)
    }
    const getCategory = async () => {
        const res = await axios.get('/categories')
        const categories = res.data
        setCategories(categories)
        console.log(categories)
    }
    const changeCategory = (category) => {
        setCurrentCategory(category)
    }
    const handleFormVisible = (formVisible) => {
        setFormVisible(formVisible)
    }
    const handleRegister = (isRegister) => {
        setIsRegistering(isRegister)
    }
    const handleLogin = (isLogging) => {
        setIsLogging(isLogging)
    }
    const logout = () => {
        axios.post('logout', { withCredentials: true })
            .then(res => {
                setIsLoggedIn(false)
                console.log('logout')
                console.log(document.cookie)
                document.cookie = "sessionID=; expires= Thu, 21 Aug 2014 20:00:00 UTC"
                localStorage.clear()

                // window.location.reload()
            }).catch(err => {
                console.log(err)
            })

    }
    const login = async (username, password) => {
        const user = {
            username: username,
            password: password
        }
        axios.post('/login', user, { withCredentials: true })
            .then(res => {
                console.log(res.data)
                if (res.data.username) {
                    if (!localStorage.getItem('username') && !localStorage.getItem('password') && !isLoggedIn) {
                        localStorage.setItem('username', username)
                        localStorage.setItem('password', password)
                    }
                    setCurrentUser(res.data)
                    setIsLoggedIn(true)
                    handleLogin(false)
                } else {
                    if (res.status === 400) {
                        setError(res.data.message)
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })

    }
    const handleLike = async (postId) => {
        const data = {
            username: currentUser.username,
            id: postId
        }
        try {
            const res = await axios.patch('/posts/like', { data }, { withCredentials: true })
            console.log(res.data)
            setIsUpdate(!isUpdate)
        } catch (err) {
            console.log(err)
        }
    }
    const handleDislike = async (postId) => {
        const data = {
            username: currentUser.username,
            id: postId
        }
        try {
            const res = await axios.patch('/posts/dislike', { data }, { withCredentials: true })
            console.log(res.data)
            setIsUpdate(!isUpdate)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="body">
            <div className="main-container">
                {isLogging ? <LoginForm handleLogin={handleLogin} login={login} err={err} /> : ""}
                {isRegistering ? <RegisterForm handleRegister={handleRegister} /> : ""}
                {formVisible ? <Form handleFormVisible={handleFormVisible} categories={categories} currentUser={currentUser} /> : ""}
                <Router>
                    <Sidebar
                        posts={posts}
                        categories={categories}
                        changeCategory={changeCategory}
                        currentCategory={currentCategory}
                        isLoggedIn={isLoggedIn}
                        handleRegister={handleRegister}
                        handleLogin={handleLogin}
                        currentUser={currentUser}
                        logout={logout}
                    />
                    <Switch>
                        <Route exact path="/" render={() =>
                            <Posts
                                posts={posts}
                                currentCategory={currentCategory}
                                handleFormVisible={handleFormVisible}
                                users={users}
                                isLoggedIn={isLoggedIn}
                                handleLike={handleLike}
                                handleDislike={handleDislike}
                            />} />
                        <Route path="/post/:id" render={() =>
                            <PostsDetail
                                users={users}
                                currentUser={currentUser}
                                isLoggedIn={isLoggedIn}
                            />} />
                    </Switch>

                </Router>


            </div>
        </div>
    )
}

export default App
