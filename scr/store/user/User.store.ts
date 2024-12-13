import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { ToastCustom }  from "../../helpers/toast.helper";
import { Authorization } from "../../interfaces/general/general.interfaces"; 
import { withBackdrop } from "../../helpers/general.helper";
import geo_back_api from "../../api/ruteo_back.api"; 
import { JsonToAuthorizationMapper } from "../../mapper/userMapper"; 
import { isAxiosError } from "axios";


 
interface UserState { 
  authorization:Authorization;
  isAuthenticated: boolean;
  login: (user:string, password:string,navigate: (path: string) => void) => void;
  logout: () => void; 
  validateToken: () => Promise<void>
}
const initStateUser:Authorization={
  userInformixId:0,
  userPostgreId:0,
  userName:'',
  fullName:'',
  provinceName:'',
  provinceAcronym:'',
  employeeId:0,
  profileId:0,
  pisitionId:0,
  userType:'',
  timeSession:0,
  accessToken:'',
  tokenType:'',
}


const userStore:StateCreator<UserState,[["zustand/devtools", never], ["zustand/immer", never]]>=(set,get)=>({  
    authorization:initStateUser, 
    isAuthenticated: false, 
    logout: () => { 
      set({ authorization: initStateUser,isAuthenticated: false });
    }, 
    login: async (user:string, password:string, navigate: (path: string) => void) => { 
        const data = {username:user,password}; 
        await withBackdrop(async () => {
          const response = await geo_back_api.post('/login',data);
          const user=JsonToAuthorizationMapper(response.data);
          set((state)=>{ state.authorization= user }); 
          set((state)=>{ state.isAuthenticated= true })
          ToastCustom.fire({
            icon: "success",
            title: "Usuario logeado..!"
          });
          navigate('/');  
        }); 
    }, 
    validateToken: async () => {  
      try {
        await geo_back_api('/validateToken',{
          headers:{
            'Authorization':`Bearer ${get().authorization.accessToken}` 
          }
        }); 
        
      } catch (error) {
        let message = 'Token invalido'; // Mensaje por defecto
        // Verificar si el error tiene la estructura esperada
        if ( isAxiosError(error) && error.response && error.response.data && error.response.data.detail ) { 
            // Intentar convertir el valor de 'detail' a JSON si es posible
            let detailString = error.response.data.detail as string;
        
            // Verificar si es un array o un string
            if (typeof detailString === 'string') {
              try {
                // Intentar convertir a objeto/array en caso de que sea un string JSON válido
                detailString = JSON.parse(detailString.replace(/'/g, '"'));
              } catch (err) {
                // Si falla la conversión, asumimos que es un string simple
                message = detailString;
              }
            }
            // Verificar si es un array o un string
            if (typeof detailString === 'object') {
              try {
                // Intentar convertir a objeto/array en caso de que sea un string JSON válido
                detailString = JSON.parse(detailString).msg??'';
              } catch (err) {
                // Si falla la conversión, asumimos que es un string simple
                message = detailString;
              }
            }
            // Si es un array, concatenar los mensajes
            if (Array.isArray(detailString)) {
              message = detailString.map((detail: { msg: string }) => detail.msg).join('<br>');
            } else if (typeof detailString === 'string') {
              // Si es un string simple, usarlo como mensaje
              message = detailString;
            }  
        } 

        ToastCustom.fire({
          icon: "error",
          title: message
        }); 
        get().logout()
        
      }
    }, 
});


export const useUserStore=create<UserState>()(
  devtools(
    persist(
      immer(
        userStore
      )
      ,{
         name:'user-store',
       }
    )
  )
);