import request from '../utils/request';


export const loginService = (data) => {
    return request.post("/api/admin/login",data)
}

export const registerService = (data) => {
    return request.post("/api/admin/register",data)
}