import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './App.css';
import store from './redux/store';
import RoutesPage from './routes/RoutesPage';
import UserInfo from './utility/userInfo';
import Test from './pages/Test';

function App() {
  const navigate = useNavigate();
  const user = false; // Assume this is your user state, replace with actual user state logic

  // useEffect(() => {
  //     if (!user) {
  //         navigate('/login'); 
  //     }
  // }, [user, navigate]); 

  return (
    <div className="h-screen bg-gray-100 ">
      <Provider store={store}>

        <RoutesPage />
        <Toaster />
        <UserInfo />
      </Provider>
      {/* <Test/> */}
    </div>
  );
}

export default App;
