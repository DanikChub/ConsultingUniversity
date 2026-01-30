import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import FooterNavBar from "./shared/ui/layot/FooterNavBar";
import NavBar from "./shared/ui/layot/NavBar";

import {observer} from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "./index"
import { check, getUserById } from "./entities/user/api/user.api";
import Spinner from "./components/Spinner/Spinner";

import "./App.css"
import {ModalProvider} from "./providers/ModalProvider";


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
      <ModalProvider>
        <NavBar/>
        {
          loading ?
          <Spinner/>
          :
          <AppRouter/>
        }


        <FooterNavBar/>
      </ModalProvider>
    </BrowserRouter>
  );
})

export default App;
