import React from 'react'
import { useNavigate } from 'react-router-dom'
function Sidebar() {

const navigate=useNavigate();

  return (
  <div className="m-3 position-fixed">  <div className='d-flex flex-column gap-3'>
        <img className="logo-text"src="src\assets\images.png" alt="" />
        <div> <i className="bi bi-house"></i> Home</div>
        <div><i className="bi bi-search"></i>search</div>
        <div><i className="bi bi-compass"></i>explore</div>
        <div><i className="bi bi-collection-play"></i>reels</div>
        <div><i className="bi bi-chat-dots-fill"></i>message</div>
        <div><i className="bi bi-chat-square-heart"></i>notification</div>
        <div><i className="bi bi-plus-square"></i>create</div>
        <div onClick={()=>{navigate('/profile')}}><i className="bi bi-person-circle"></i>profile</div>
    </div>
    <div className='position-fixed bottom-0 d-flex flex-column gap-3 mb-3'>
    <div><i className="bi bi-threads"></i>threads</div>
    <div><i className="bi bi-list"></i>more</div>
   </div>

   </div>
  )
}

export default Sidebar