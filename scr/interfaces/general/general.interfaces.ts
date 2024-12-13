export interface ResponseInterface{
    sql_err:number;
    sql_msn: string;
    data: any;
}


export interface OptionsSelect {
    label:string;
    value:number;
}

export interface Authorization{ 
    userInformixId:number;
    userPostgreId:number;
    userName:string;
    fullName:string;
    provinceName:string;
    provinceAcronym:string;
    employeeId:number;
    profileId:number;
    pisitionId:number;
    userType:string;
    timeSession:number;
    accessToken:string;
    tokenType:string;
}