import React, { useEffect, useState } from 'react'
import PersonIcon from '@material-ui/icons/Person';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@material-ui/icons/ThumbDownAltRounded';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { Link } from 'react-router-dom'
import Profile from '../../Profile';
const Post = ({ post, users, disable, handleLike, handleDislike }) => {
  const [show, setShow] = useState(false)
  const [isShowProfile, setIsShowProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})

  const handleShowProfile = (show) => {
    setIsShowProfile(true)
    setSelectedUser(users.find(user => user.username === post.creator))
  }

  // const showProfile = ({user}) =>{

  // }

  return (
    <div className="post" >
      {isShowProfile ? <Profile user={selectedUser} closeProfile={() => setIsShowProfile(false)} /> : ''}
      <div className="left">
        <div className="avatar" onClick={() => handleShowProfile()}>
          {users ? users.map((user, index) => {
            if (post.creator === user.username) {
              if (user.icon === '') {
                return <PersonIcon />
              } else {
                return <img key={index} src={user.icon}></img>
              }
            }
          }

          ) : ""}
          {show ?
            <div className="extra-info">

            </div> : ''}
        </div>
        <p className="post-author">{post.creator}</p>
      </div>

      <div className="description">
        {
          disable ?
            <div className="upper">
              <h2 className="post-name">{post.title}</h2>
            </div> :
            <div className="upper">
              <Link to={`post/${post._id}`}><h2 className="post-name">{post.title}</h2></Link>
            </div>
        }

        <div className="lower">
          <p className="post-time">posted on {post.createdAt ? post.createdAt.substring(0, 10) : ' '}</p>
        </div>
      </div>

      <div className="right">
        <div className="group">
          <div>
            <button className="like" onClick={() => handleLike(post._id)}>
              <ThumbUpAltRoundedIcon />
            </button>
            <p className="like-count" >{post.likeCount ? post.likeCount.length : ''}</p>
          </div>
          <div>
            <button className="dislike" onClick={() => handleDislike(post._id)}>
              <ThumbDownAltRoundedIcon />
            </button>
            <p className="dislike-count" >{post.dislikeCount ? post.dislikeCount.length : ''}</p>
          </div>
          <div>
            <button className="comment">
              <ChatBubbleIcon />
            </button>
            <p className="comment-count">{post.response ? post.response.length : ''}</p>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Post
