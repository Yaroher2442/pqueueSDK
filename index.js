// import {ApiProvider} from "./models";
import axios from "axios";
import User from "./models.ts"
// let token = ApiProvider.auth("root","1234");
// let povider = new ApiProvider(token);

export class ApiProvider{
    baseUrl;
    static token;
    timeout;
    static axiosInstance = axios.create({
        baseURL: "",
        timeout: 0,
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
        },
    });
    endpoint_map = {
        Users: "user",
        Commpany: "COMPANY"
    }
    constructor (baseUrl,token="",timeout =5000) {
        ApiProvider.token = token;
        this.baseUrl = baseUrl;
        this.timeout=timeout;
        ApiProvider.axiosInstance.defaults.baseURL = this.baseUrl;
        ApiProvider.axiosInstance.defaults.timeout = this.timeout;
    }
    static setAuth(){
        ApiProvider.axiosInstance.defaults.headers.authorization ="Bearer "+ApiProvider.token;
    }
    static unsetAuth(){
        ApiProvider.axiosInstance.defaults.headers.authorization = ""
    }
    static async auth(username, password) {
        const res  =await ApiProvider.axiosInstance.post('/auth',{"username":username, "password":password})
        ApiProvider.setAuth(res.data.mytoken)
        ApiProvider.token =res.data.mytoken
    }

    async get(route){
        const  res = await ApiProvider.axiosInstance.get(route)
        console.log(res.data)
        return res.data
    }
    async post(route, dtoInstance){
        const  res = await ApiProvider.axiosInstance.post(route,dtoInstance)
        return res.data
    }
    async put(route, entityID, dtoInstance){
        const  res = await ApiProvider.axiosInstance.put(route,dtoInstance)
        return res.data
    }
    async delete(route, entityID){
        const  res = await ApiProvider.axiosInstance.delete(route)
        return res.data
    }
}

async function  withAuth(f,args) {
    return function() {
        ApiProvider.setAuth(ApiProvider.token)
        let result = f(...args) // (*)
        ApiProvider.unsetAuth()
        return result;
    }()
}
let provider = new ApiProvider("http://192.168.4.191:8888");
await ApiProvider.auth("root","1234")
await withAuth(provider.get, ["/company"])
await provider.get("/company")