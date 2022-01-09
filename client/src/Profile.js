import React, { useState } from 'react'
import PersonIcon from '@material-ui/icons/Person';
import moment from 'moment'


const Profile = ({ user = {}, closeProfile }) => {
    console.log(user)

    return (
        <div className="form-container profile-container">
            <div className="overlay-background"></div>
            <form className="login-form profile" >
                <div className='profile-head'>
                    <h2 className='header-center'>Profile of {user.username}</h2>
                    <div className="avatar">
                        {
                            user && user.icon !== '' ? <img src={user.icon}></img> : <PersonIcon />
                        }
                    </div>
                </div>

                <div className='user-info'>
                    <div className='left'>Username:</div>
                    <div className=''>{user.username}</div>
                </div>
                <div className='user-info'>
                    <div className='left'>Joined at:</div>
                    <div className=''>{moment(user.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                </div>
                <div className='user-info'>
                    <div className='left'>Level: </div>
                    <div className=''>{user.level}</div>
                </div>
                <div className="button-group">
                    <button type="button" className="cancel-btn" onClick={() => closeProfile()}>Close</button>
                </div>
            </form>
        </div>
    )
}

export default Profile
