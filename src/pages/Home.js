import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WS_URL, getReq } from '../apis/Api';
import {
    acceptFriendRequest,
    deleteRequest,
    fetchPendingRequests,
    getAllUsers,
    getFriend,
    sendFriendRequest
} from '../redux/slice/friendsSlice';
import { getTime } from '../utility/SmallFunction';
import io from 'socket.io-client';
import ButtonComponent from '../components/ButtonComponent';
import BoxLoader from '../utility/BoxLoader';
import { X } from 'react-feather';
import cat1 from '../assets/images/cat_1.png';

const Home = () => {
    const [chatFriendsList, setChatFriendsList] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [useSelectedProfile, setSelectedProfile] = useState(false);
    const [useContactLoader, setContactLoader] = useState(true);
    const [friendSelected, setFriendSelected] = useState({}); // Changed state structure
    const [useIsLoading, setIsLoading] = useState(true);
    const [friendChats, setFriendChats] = useState([]);
    const [useFriendListType, setFriendListType] = useState("friends");
    const [newMessage, setNewMessage] = useState('');
    const [useIsTyping, setIsTyping] = useState(false);
    const userData = useSelector((state) => state?.user?.userData);
    const dispatch = useDispatch();
    const friendList = useSelector((state) => state.friend.friendList);
    const reqSendList = useSelector((state) => state.friend.reqSendList);

    const isLoading = useSelector((state) => state.friend.isLoading);
    const btnLoading = useSelector((state) => state.friend.btnLoading);
    const error = useSelector((state) => state.friend.error);
    const [socket, setSocket] = useState(null);

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (userData?._id) {
            // Establish socket connection with user ID
            const newSocket = io(`${WS_URL}/?username=${userData?._id}`);
            setSocket(newSocket);
            return () => newSocket.close();
        }
    }, [userData]);

    useEffect(() => {
        setContactLoader(true);
        // Fetch initial chat friends list
        getReq('getFriendsWithChat')
            .then((res) => {
                setChatFriendsList(res.friends);
            })
            .catch((err) => console.log(err))
            .finally(() => setContactLoader(false));

    }, []);

    useEffect(() => {
        if (friendSelected._id) {
            setIsLoading(true);
            // Fetch chat messages with selected friend
            getReq('getFrndChats', friendSelected._id)
                .then((res) => {
                    setFriendChats(res.chats);
                })
                .catch((err) => console.log(err))
                .finally(() => setIsLoading(false));
        }
    }, [friendSelected]);

    useEffect(() => {
        dispatch(getFriend());
    }, [dispatch]);

    useEffect(() => {
        if (socket) {
            // Listen for new messages from socket
            socket.on('newMessage', ({ sender, message }) => {
                console.log("newMessage", sender, message);
                // Update chat messages state with new message
                setFriendChats((prevChats) => [
                    ...prevChats,
                    { sender_id: sender, content: { text: message, sent: new Date().toISOString() } }
                ]);
            });

            socket.on('userTyping', ({ sender, typing }) => {
                // Check if the typing indicator is for the currently selected friend
                if (sender === friendSelected._id) {
                    setIsTyping(typing); // Set typing state based on 'typing' value received
                }
            });
            return () => {
                socket.off('newMessage');
                socket.off('userTyping');
                setIsTyping(false)
            };
        }
    }, [socket, friendSelected]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [friendChats]);

    const toggleProfile = () => setShowProfile(!showProfile);

    const handleSendMessage = () => {
        // Send new message via socket
        socket.emit('newMessage', { recipient: friendSelected?._id, message: newMessage });
        // Update chat messages state with sent message
        setFriendChats((prevChats) => [
            ...prevChats,
            { sender_id: userData._id, content: { text: newMessage, sent: new Date().toISOString() } }
        ]);
        setNewMessage('');
    }

    const handleNewMesageInput = (e) => {
         setNewMessage(e.target.value)
        socket.emit('userTyping', { recipient: friendSelected?._id, typing: newMessage });

    }

    return (
        <div className="flex gap-4 p-4 pt-2 h-full border">
            <div className="w-1/5 bg-white rounded-lg shadow-md">
                <div className='flex items-center p-5 h-[50px]'>
                    <h5 className="text-md font-semibold">Chats</h5>
                </div>
                <hr />
                <div className="p-1 flex flex-col gap-1 overflow-auto hideScroll" style={{ height: "calc(100% - 55px)" }}>
                    {
                        useContactLoader && <div className="flex items-center mt-4">
                            <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                            <div>
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                                <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                        </div>
                    }

                    {chatFriendsList && chatFriendsList.map((elm) => (
                        <div key={elm?.friend?._id} onClick={() => setFriendSelected(elm.friend)} className={`flex items-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-gray-50 ${friendSelected?._id === elm?.friend?._id ? 'bg-gray-50' : ''}`}>
                            <img className="w-10 h-10 rounded-full" src={elm?.friend?.profile_pic} alt="" />
                            <div className="flex-1 min-w-0 ms-1">
                                <div className='flex justify-between capitalize'>
                                    <p className="text-sm font-medium text-gray-900 truncate">{elm?.friend?.first_name}</p>
                                    <div className="inline-flex items-center text-xs text-gray-400">{getTime(elm?.lastMessageTime)}</div>
                                </div>
                                <div className='flex justify-between'>
                                    <p className="text-sm text-gray-500 truncate">{elm?.lastMessage?.content?.text}</p>
                                    {elm?.unreadCount > 0 && (
                                        <div className="inline-flex items-center justify-center w-6 h-6 text-xs text-white bg-red-500 border-2 border-white rounded-full">{elm.unreadCount}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {
                friendSelected._id &&
                <div className="flex-1 bg-white rounded-lg shadow-md">
                    <div className='px-2 h-[50px]'>
                        <div onClick={toggleProfile} className="flex items-center gap-4">
                            <img className="w-7 h-7 rounded-full" src={friendSelected.profile_pic} alt="" />
                            <div className='capitalize'>
                                <p className='text'>{friendSelected.first_name}</p>
                                <p className="text-xs text-gray-400">{getTime(friendSelected.lastSeen)}</p>
                                {
                                    useIsTyping &&  <p className='text'>Typing...</p>
                                }
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div ref={chatContainerRef} className=" p-1 px-3 gap-2 overflow-auto hideScroll" style={{ height: "calc(100% - 100px)" }}>

                        {
                            useIsLoading && <BoxLoader />
                        }
                        <div className='flex flex-col'>
                            {friendChats && friendChats.map((message) => (
                                <div key={message._id} className={`w-full max-w-[320px] px-4 py-2 mb-1 border-gray-200 bg-gray-100 rounded-xl ${message.sender_id === userData?._id ? 'self-end rounded-se-none ' : 'self-start rounded-es-none'}`}>
                                    <p className="text-sm text-start font-normal text-gray-900">{message?.content?.text}</p>
                                    <p className="text-end text-xs">{getTime(message?.content?.sent)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr />
                    <div className="flex gap-4 justify-center items-center px-4 mt-1">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Type a message"
                            value={newMessage}
                            onChange={handleNewMesageInput}
                        />
                        <button type="button" onClick={handleSendMessage} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                            <span className="sr-only">Send Message</span>
                        </button>
                    </div>
                </div>
            }
            {
                !friendSelected._id && <div className="flex-1 bg-white rounded-lg shadow-md flex justify-center flex-col items-center">
                    <img src={cat1} width={300} />
                    <h4>Select contact to start messages!</h4>
                </div>
            }
            <div className={`w-1/5 flex flex-col ${useSelectedProfile ? 'gap-4' : ''}`}>
                <div className={`bg-white rounded-lg shadow-md transition-all duration-800  overflow-hidden  ${useSelectedProfile ? 'h-[310px]' : 'h-[0px]'}`}>
                    <div className='flex items-center justify-between p-5 h-[50px]'>
                        <div className='flex items-center capitalize'>
                            <h5 className="text-md font-semibold ">{useSelectedProfile?.first_name}</h5>
                            <h5 className="text-md font-semibold ">{useSelectedProfile?.last_name}</h5>
                        </div>

                        <div className='cursor-pointer' onClick={() => setSelectedProfile(false)}>
                            <X size={16} color='#5D6166' />
                        </div>
                    </div>
                    <hr />
                    <div className="p-4">
                        <div className="relative flex flex-col items-center gap-2">
                            <div className="relative">
                                <img className="w-[100px] h-[100px] rounded" src={useSelectedProfile?.profile_pic} alt="" />
                                <span className="absolute bottom-0 animate-pulse right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
                            </div>
                            <div className='text-center'>
                                <p className="text-gray-500">{useSelectedProfile?.email}</p>
                                <p className="text-sm text-gray-400">Last seen: {getTime(useSelectedProfile?.lastSeen)}</p>
                                <p className="text-sm text-gray-400">{useSelectedProfile?.description?.slice(0, 40)}</p>
                            </div>
                            <div className="flex mt-2 gap-3">
                                <ButtonComponent
                                    title="210 Friends"
                                    size='md'
                                    className=' grow'
                                    variant={`primary`}
                                // onClick={() => { dispatch(fetchPendingRequests()); setFriendListType("request") }}
                                />
                                <ButtonComponent
                                    title="Remove"
                                    size='sm'
                                    className=' grow'
                                    variant={`text`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-md transition-all duration-300">
                    <div className='flex items-center p-5 h-[50px]'>
                        <div className="flex flex-wrap gap-1 text-sm text-center text-gray-500">
                            <ButtonComponent
                                title="Friends"
                                size='sm'
                                variant={`${useFriendListType === "friends" ? 'primary' : 'text'}`}
                                onClick={() => { dispatch(getFriend()); setFriendListType("friends") }}
                            />
                            <ButtonComponent
                                title="Requests"
                                size='sm'
                                variant={`${useFriendListType === "request" ? 'primary' : 'text'}`}
                                onClick={() => { dispatch(fetchPendingRequests()); setFriendListType("request") }}
                            />
                            <ButtonComponent
                                title="New"
                                size='sm'
                                variant={`${useFriendListType === "new" ? 'primary' : 'text'}`}
                                onClick={() => { dispatch(getAllUsers()); setFriendListType("new") }}
                            />

                        </div>
                    </div>
                    <hr />
                    <div className="p-4 flex flex-col gap-3 overflow-auto hideScroll" style={{ height: "calc(100% - 60px)" }}>
                        {
                            error && <p>{error}</p>
                        }

                        {
                            isLoading && <BoxLoader />
                        }
                        {!error && !isLoading && friendList.map((elm) => (
                            <div key={elm._id} className="flex items-center gap-4">
                                <img className="w-10 h-10 rounded-full" src={elm.profile_pic} alt="Friend request" />
                                <div>
                                    <h4 className="font-semibold    ">{elm?.first_name} {elm?.last_name}</h4>
                                    <div className='flex gap-2'>
                                        <ButtonComponent
                                            variant='text'
                                            title="View"
                                            size='xs'
                                            onClick={() => setSelectedProfile(elm)}
                                        />
                                        {
                                            useFriendListType === "new" && reqSendList.includes(elm._id) ?
                                                <ButtonComponent
                                                    variant='secondary'
                                                    title="delete"
                                                    size='xs'
                                                    onClick={() => dispatch(deleteRequest(elm._id))}
                                                /> : useFriendListType === "new" &&
                                                <ButtonComponent
                                                    variant='secondary'
                                                    title="Request"
                                                    size='xs'
                                                    onClick={() => dispatch(sendFriendRequest(elm._id))}
                                                />

                                        }

                                        {
                                            useFriendListType === "request" &&
                                            <ButtonComponent
                                                variant='secondary'
                                                title="Accept"
                                                size='xs'
                                                onClick={() => dispatch(acceptFriendRequest(elm._id))}
                                            />
                                        }
                                        {
                                            useFriendListType === "friends" &&
                                            <ButtonComponent
                                                variant='secondary'
                                                title="Remove"
                                                size='xs'
                                                onClick={() => dispatch(sendFriendRequest(elm._id))}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
