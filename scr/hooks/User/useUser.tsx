import { useState } from "react";
import { useUserStore } from "../../store/user/User.store";
import { useNavigate } from "react-router-dom";


const useUser=() => {
    //Constants
    const navigate = useNavigate();
    //UseState
    const [formLogin,setFormLogin]=useState({user:'',password:''});
    //Zustand
    const login=useUserStore(state=>state.login);
    const logout=useUserStore(state=>state.logout);
    const authorization=useUserStore(state=>state.authorization);

    return {
        login,
        formLogin,
        setFormLogin,
        navigate,
        authorization,
        logout
    }

}

export default useUser;