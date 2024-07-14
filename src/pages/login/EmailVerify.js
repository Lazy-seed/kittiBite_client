import React, { useState, useRef, useEffect } from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoTextComponent from '../../components/LogoTextComponent';
import { postReq } from '../../apis/Api';
import toast from 'react-hot-toast';
import { setUser } from '../../redux/slice/userSlice';
import { useDispatch } from 'react-redux';

export default function EmailVerify() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [useBtnLoader, setBtnLoader] = useState(false)
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
    const inputRefs = useRef([]);

    const handleInputChange = (index, value) => {
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // If the current input field is filled and there's a next input field, focus on it
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setBtnLoader(true)
        console.log("verificationCode", verificationCode);
        let code = ''
        for (let i = 0; i < verificationCode.length; i++) {
            if (verificationCode[i] === '') {
                inputRefs.current[i].focus();
                return toast.error("Invalid Code!")

            }
            code += verificationCode[i]
        }

        postReq('verifyCode', { code: Number(code), email: location.state.email })
            .then((res) => {
                console.log(res)
                if (res.success) {
                    navigate('/LoginProfile')
                    dispatch(setUser(res.user))
                } else {
                    toast.error("Invalid Code!")
                }
            })
            .catch((err) => console.log(err))
            .finally(() => setBtnLoader(false))

    }
    useEffect(() => {

        const handleBackspace = (e) => {
            if (e.key === 'Backspace') {
                const currentIndex = inputRefs.current.findIndex((ref) => ref === document.activeElement);
                if (currentIndex > 0 && !verificationCode[currentIndex]) {
                    inputRefs.current[currentIndex - 1].focus();
                }
            }
        };

        document.addEventListener('keydown', handleBackspace);

        return () => {
            document.removeEventListener('keydown', handleBackspace);
        };
    }, [verificationCode]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <LogoTextComponent title="Register" />
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                            Email Verification
                        </p>
                        <form action={handleFormSubmit}>
                            <div className="flex justify-between mt-4">
                                {verificationCode.map((value, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        ref={(ref) => (inputRefs.current[index] = ref)} // Store reference to each input field
                                        className="w-12 h-12 bg-gray-50 border border-gray-300 text-center text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={value}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                    />
                                ))}
                            </div>
                            <p className=' text-red-700'>Invalid Code</p>
                            <div className='pt-5'>
                                <ButtonComponent
                                    type='submit'
                                    title="Login"
                                    onClick={handleFormSubmit}
                                    loading={useBtnLoader}
                                    disabled={useBtnLoader}
                                />
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
