import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../images/cover/cover-01.png';  
import { Authorization } from '../interfaces/general/general.interfaces';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface ProfileProps {
  authorization: Authorization
}

const Profile = ({authorization}:ProfileProps) => { 
  return (
    <>
      <Breadcrumb pageName="Perfil" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          /> 
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <AccountCircleIcon style={{height:'100%', width:'100%'}} className='text-black' /> 
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {authorization.fullName}
            </h3>
            <p className="font-medium">{authorization.userName}</p>
            <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-2 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {authorization.provinceName}
                </span>
                <span className="text-sm">Provincia</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {authorization.provinceAcronym}
                </span>
                <span className="text-sm">Acronimo</span>
              </div> 
            </div> 
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
