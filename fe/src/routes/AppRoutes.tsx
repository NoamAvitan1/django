import {createBrowserRouter , RouterProvider ,Route ,createRoutesFromElements} from 'react-router-dom'
import { Home } from '../components/home/Home';
import { Header } from '../components/header/Header';
import { DynamicForm } from '../components/login/DynamicForm';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../jotai/UserAtom';

type Props = {

};

export const AppRoutes = () => {
  const [user,setUser] = useAtom(userAtom);
  useEffect(()=> {
    const get = async() => {
      const res = await fetch('http://127.0.0.1:8000/staylogin/',{
        method: 'GET',
        headers:{
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json();
      setUser(data.user);
      console.log(data);
    }
    get();
  },[])
    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<Header/>}>
          <Route index element={<Home/>}/>
          <Route path='/login' element={<DynamicForm/>}/>
        </Route>
      )
    )

    return (
        <div className=''>
            <RouterProvider router={router}/>
        </div>
  )
  }