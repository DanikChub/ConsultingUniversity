import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import FooterNavBar from "./components/FooterNavBar/FooterNavBar";
import NavBar from "./components/NavBar/NavBar";

import {observer} from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "./index"
import { check, getUserById } from "./http/userAPI";
import Spinner from "./components/Spinner/Spinner";

import "./App.css"


const App = observer(() => {
  const {user} = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    check().then(data => {
   
      getUserById(data.id)
      .then(data => {
        user.setUser(data)
        user.setIsAuth(true);
      })
      .finally(() => setLoading(false))
      
    }).catch(e => {
      setLoading(false);
    }) 
  }, [])

  

  return (
    <BrowserRouter>
      <NavBar/>
      {
        loading ?
        <Spinner/>
        :
        <AppRouter/>
      }
  
      
      <FooterNavBar/>
    </BrowserRouter>
  );
})

export default App;
