import React from 'react';
import useUser from '../../hooks/User/useUser';

const SignIn: React.FC = () => {
  const {
    login,
    formLogin,
    setFormLogin,
    navigate
  }=useUser();
  return (
    <div className="h-screen overflow-hidden  items-center justify-center" style={{background: '#edf2f7'}}>
      <div className="bg-white dark:bg-gray-900">
          <div className="flex justify-center h-screen">
              <div className="hidden bg-cover lg:block lg:w-2/3" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.7)),url(https://www.ecommercenews.pe/wp-content/uploads/2024/09/urbano-16x9-1-810x456.jpg)"}}>
                  <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                      <div>
                          <h2 className="text-4xl font-bold text-white">URBANO</h2>
                          <p className="max-w-xl mt-3 text-white">Gestion de Ruteo  y Gereferenciación</p>
                      </div>
                  </div>
              </div>
              <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                  <div className="flex-1">
                      <div className="text-center">
                          <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">URBANO</h2>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">Log in para acceder a tu cuenta</p>
                      </div>
                      <div className="mt-8">
                          <form>
                              <div>
                                  <label  className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Usuario</label>
                                  <input 
                                    type="text" 
                                    name="usuario" 
                                    id="user" 
                                    placeholder="usuario.example" 
                                    value={formLogin.user} 
                                    onChange={(e)=>setFormLogin((prev)=>( {password:prev.password ,user:e.target.value}))}
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                              </div>
                              <div className="mt-6">
                                  <div className="flex justify-between mb-2">
                                      <label   className="text-sm text-gray-600 dark:text-gray-200">Contraseña</label>
                                  </div>
                                  <input 
                                    type="password" 
                                    name="constraseña" 
                                    id="password" 
                                    placeholder="constraseña" 
                                    value={formLogin.password}  
                                    onChange={(e)=>setFormLogin((prev)=>( {password:e.target.value ,user:prev.user}))}
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                              </div>
                              <div className="mt-6">
                                  <button
                                      type='button'
                                      disabled={(formLogin.user.length>0&&formLogin.password.length>0)?false:true}
                                      onClick={()=>login(formLogin.user,formLogin.password,navigate)}
                                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:bg-slate-500">
                                      Log in
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SignIn;
