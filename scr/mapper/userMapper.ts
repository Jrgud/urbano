import { Authorization } from "../interfaces/general/general.interfaces"; 

export function JsonToAuthorizationMapper(array:any){
    const user:Authorization={
        userPostgreId:array['id_user_postgre'],
        userInformixId:array['id_user_informix'],
        userName:array['usuario'],
        fullName:array['nombre'],
        provinceName:array['prov_nombre'],
        provinceAcronym:array['prov_sigla'],
        employeeId:array['per_id'],
        profileId:array['perfil'],
        pisitionId:array['id_cargo'],
        userType:array['usr_tipo'],
        timeSession:array['time_session'],
        accessToken:array['access_token'],
        tokenType:array['token_type'],
    }
    return user;
};