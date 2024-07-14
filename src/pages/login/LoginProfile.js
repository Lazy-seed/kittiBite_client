import React, { useEffect, useState } from 'react';
import InputComponent from '../../components/InputComponent';
import { getReq, postReq } from '../../apis/Api';
import LogoTextComponent from '../../components/LogoTextComponent';
import ButtonComponent from '../../components/ButtonComponent';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function LoginProfile() {
    const navigate = useNavigate()
    const [useShowImgs, setShowImgs] = useState(false)
    const [useImagsList, setImagsList] = useState(false)

    const [useBtnLoader, setBtnLoader] = useState(false)
    const [useLoginData, setLoginData] = useState({
        first_name: "",
        last_name: "",
        description: "Hey, im using bite",
        birthDate: "",
        profile_pic: ""
    })

    useEffect(() => {
        getReq("defaultProfileImages")
        .then((res) =>{
            console.log(res)
            setImagsList(res.result)
        } )
    }, [])

    const handleFormSubmit = (e) => {
        // e.preventDefault()
        console.log(useLoginData)
        if ((useLoginData.first_name === "") || (useLoginData.last_name === "") || (useLoginData.description === "") || (useLoginData.birthDate === "") || (useLoginData.profile_pic === "")) {
            return toast.error("All fields are required.");
        }
        setBtnLoader(true)
        postReq("updateProfile", {...useLoginData, profile_pic:useLoginData.profile_pic.imgUrl})
            .then((res) => {
                if (res.success) {
                    navigate('/')
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
    
    const toggleImgs = () => { setShowImgs(!useShowImgs) }
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <LogoTextComponent title="Your Profile" />
               
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                       
                        <form className=" ">
                            <div className="flex flex-wrap gap-4 justify-center mb-4">
                                {useShowImgs ?
                                    <img onClick={toggleImgs} className="w-48 h-48 rounded-full border border-gray-400 shadow-lg transition-all duration-300 hover:scale-110" src={useLoginData?.profile_pic?.imgUrl} alt="Bonnie image" />
                                    :
                                    useImagsList && useImagsList.map((data, index) => (
                                        <img key={index} onClick={() => {toggleImgs(); setLoginData((prev) =>({...prev, profile_pic:data}) )}} className="w-24 h-24 rounded-full border border-gray-400 shadow-lg transition-all duration-300 hover:scale-110" src={data.imgUrl} alt="Bonnie image" />
                                    ))
                                }
                            </div>
                            <div className="flex flex-col md:flex-row md:space-x-4">
                                <InputComponent
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    title="First Name"
                                    placeholder="First Name"
                                    setInputChange={(e) => setLoginData(prev => ({ ...prev, first_name: e.target.value }))}
                                    value={useLoginData.first_name}
                                    required={true}
                                />
                                <InputComponent
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    title="Last Name"
                                    placeholder="Last Name"
                                    setInputChange={(e) => setLoginData(prev => ({ ...prev, last_name: e.target.value }))}
                                    value={useLoginData.last_name}
                                    required={true}
                                />
                            </div>
                            <InputComponent
                                    type="date"
                                    name="birthDate"
                                    id="birthDate"
                                    title="Birth Date"
                                    className='mt-2'
                                    setInputChange={(e) => setLoginData(prev => ({ ...prev, birthDate: e.target.value }))}
                                    value={useLoginData.birthDate}
                                    required={true}
                                /> 
                            <InputComponent
                                    type="text"
                                    name="description"
                                    id="description"
                                    title="Description"
                                    className='mt-2'
                                    placeholder="Hey, im using bite"
                                    setInputChange={(e) => setLoginData(prev => ({ ...prev, desc: e.target.value }))}
                                    value={useLoginData.description}
                                    required={true}
                                /> 
                                <ButtonComponent
                                title="Save"
                                className='mt-5'
                                variant="primary"
                                loading={useBtnLoader}
                                disabled={useBtnLoader}
                                onClick={handleFormSubmit}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
