import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { postReq } from '../../apis/Api'
import ButtonComponent from '../../components/ButtonComponent'
import InputComponent from '../../components/InputComponent'
import LogoTextComponent from '../../components/LogoTextComponent'

export default function Signup() {
    const navigate = useNavigate()
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
        if (useLoginData.email === ""  ) {
            document.getElementById("email").focus()
          return   toast.error("Email cannot be emtpy! ")
        } else if (useLoginData.password === "" ) {
            document.getElementById("password").focus()
            return  toast.error("password cannot be emtpy! ")
        }
        setBtnLoader(true)
        postReq("signup", useLoginData)
            .then((res) => {
                console.log(res);
                if (res.success) {
                    navigate('/email', {state:{email:useLoginData.email}})
                    return toast.success(res.msg)
                } else{
                    return toast.error(res.msg)
                }
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setBtnLoader(false)
            })
    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900 ">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <LogoTextComponent title="Register" />

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
                            <ButtonComponent
                            type='submit'
                                title="Register"
                                variant="primary"
                                loading={useBtnLoader}
                                disabled={useBtnLoader}
                                onClick={handleForm}
                            />
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <Link to='/' className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
