import React from 'react'
import { useDispatch } from 'react-redux'
import { getReq } from '../apis/Api'
import { setUser } from '../redux/slice/userSlice'

export default function UserInfo() {
  const dispatch =useDispatch()

  getReq('userInfo').then((res) => dispatch(setUser(res.user)) ).catch((err) => console.log(err))

  return (
    <div></div>
  )
}
