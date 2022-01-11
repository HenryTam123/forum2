import React, { useState } from 'react';
import axios from './axios';
import CloseIcon from '@material-ui/icons/Close';


const Form = ({ handleFormVisible, categories, currentUser }) => {

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('news')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newPost = {
            creator: currentUser.username,
            title: title,
            category: category
        }
        const res = await axios.post('/posts', { ...newPost }, { withCredentials: true })
        window.location.reload()
    }
    return (

        <div className="form-container">
            <div className="overlay-background" onClick={() => handleFormVisible(false)}></div>
            <form className="login-form" onSubmit={(e) => handleSubmit(e)}>
                <h2>Create new post here</h2>
                <label>Title <input autoComplete="off" type="text" name="title" value={title} required onChange={(e) => setTitle(e.target.value)}></input></label>

                <label>Category
                    <select required type="text" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map((category, index) => (
                            <option key={index} value={`${category.category}`}>
                                {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                            </option>
                        ))}
                    </select></label>
                <div className="button-group">
                    <button type="submit" className="submit-btn" >Submit</button>
                </div>
                <button className="close-button" onClick={() => handleFormVisible(false)}><CloseIcon /></button>

            </form>
        </div>
    )
}

export default Form
