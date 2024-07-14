import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { postReq } from '../../apis/Api'
import ButtonComponent from '../../components/ButtonComponent'
import InputComponent from '../../components/InputComponent'
import { setUser } from '../../redux/slice/userSlice'
import LogoTextComponent from '../../components/LogoTextComponent'

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [useBtnLoader, setBtnLoader] = useState(false)
    const [useLoginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    useEffect(() => {
        document.getElementById("email").focus()
    }, [])
    

    const handleForm = (e) => {
        e.preventDefault()
        if (useLoginData.email === "") {
        document.getElementById("email").focus()
            return toast.error("Email cannot be emtpy! ")
        } else if (useLoginData.password === "") {
        document.getElementById("password").focus()
            return toast.error("password cannot be emtpy! ")
        }
        setBtnLoader(true)
        postReq("login", useLoginData)
            .then((res) => {
                if (!res.success) {
                    toast.error(res.msg)
                } else if (!res.emailVerify) {
                    toast.error(res.msg)
                    navigate('/email', {state:{email: useLoginData.email}})
                } else if (!res.user?.first_name) {
                    toast.success(res.msg)
                    navigate('/loginProfile')
                } else {
                    navigate('/')
                    toast.success(res.msg)
                    dispatch(setUser(res.user))
                    
                }

            })
            .catch((err) => console.log(err))
            .finally(() => setBtnLoader(false))
    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900 ">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <LogoTextComponent title="Login" />
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form className="space-y-4 md:space-y-6" action={handleForm}>
                            <InputComponent
                                type="email"
                                name="email"
                                id="email"
                                title="Your Email"
                                placeholder="Enter your email"
                                setInputChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                                value={useLoginData.email}
                                required={true}
                            />
                            <div>
                                <InputComponent
                                    type="password"
                                    name="password"
                                    id="password"
                                    title="Password"
                                    placeholder="Enter your password"
                                    setInputChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                    value={useLoginData.password}
                                    required={true}
                                />
                                <div className="text-end mt-0 pt-0">
                                    <Link to='/signup' className="text-sm font-medium text-gray-400 hover:underline dark:text-primary-500">Forgot password?</Link>
                                </div>
                            </div>

                            <ButtonComponent
                            type='submit'
                                title="Login"
                                onClick={handleForm}
                                loading={useBtnLoader}
                                disabled={useBtnLoader}
                            /> 
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don`t have an account? <Link to='/signup' className="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
