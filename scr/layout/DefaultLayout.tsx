import React, { useState,  useEffect } from 'react';
// import Header from '../components/Header/index';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../components/Sidebar/index'; 
import { Backdrop, CircularProgress } from '@mui/material';
import { useGeneralStore } from '../store/general/genetal.store';
import { useUserStore } from '../store/user/User.store';
const DefaultLayout: React.FC  = ( ) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const backdrop=useGeneralStore(state=>state.backdrop);
  const validateToken=useUserStore(state=>state.validateToken);
  
  useEffect(()=>{
    validateToken()
  })

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <div className="sm:gap-4  absolute m-1.5 z-20 left-0 bottom-0" > 
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm  bg-sky-500 text-white  p-1.5   "
          > 
           {sidebarOpen ? (<MenuOpenIcon/>):(<MenuIcon/>)}
          </button>
        </div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto  p-4 md:p-6 2xl:p-10" id="defaultLayout">
              <Outlet/>
              <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999999999999999999 })}
                open={backdrop} 
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
