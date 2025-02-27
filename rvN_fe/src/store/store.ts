import { create } from "zustand";
import {CentralSignin, LocalSignin, Signin} from "@/api/index"
type ProfileStore = {
  token:string,
  role:string,
  username:string,
  userId:string,
  setUser:(userData:any)=>void,
  login:(authData:{username:string,password:string})=>Promise<void>,
  CentralLogin:(authData:{username:string,password:string})=>Promise<void>,
  AuthLogin:(authData:{username:string,password:string})=>Promise<void>,
  logout:()=>void,
  // investLogin:(authData:{username:string,password:string})=>Promise<void>,
}

export const useProfileStore=create<ProfileStore>((set)=>({
  token:"",
  role:"",
  username:"",
  userId:"",
  login:async(authData)=>{
    const response = await Signin(authData)
    console.log(response.data)
    const token: string = response.data.token;
    const role: string = response.data.role;
    const userId: string = response.data.userId;
    localStorage.setItem('Profile', JSON.stringify({ token,role,userId }));
      set(()=>({token,role,userId}));
    return response
    
  },
  CentralLogin:async(authData)=>{
    const response = await CentralSignin(authData)
    const token: string = response.data.token;
    const role: string = response.data.role;
    const userId: string = response.data.userId;
    localStorage.setItem('Profile', JSON.stringify({ token,role,userId }));
      set(()=>({token,role,userId}));
    return response
    
  },
  AuthLogin:async(authData)=>{
    const response = await LocalSignin(authData)
    const token: string = response.data.token;
    const role: string = response.data.role;
    const userId: string = response.data.userId;
    localStorage.setItem('Profile', JSON.stringify({ token,role,userId }));
      set(()=>({token,role,userId}));
    return response
    
  },
  setUser:(userData)=>{
    const { token, role,userId } = userData;
    set(()=>({ token, role, userId }));
  },
  logout:()=>{
    localStorage.clear();
    set(()=>({token:"",role:"",username:""}));
  }
}))