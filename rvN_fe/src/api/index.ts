import axios from 'axios'
const baseURL = "http://localhost:5000/"
const API = axios.create({ baseURL: baseURL})

API.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
export const Signin = (authData:{username:string,password:string}) => API.post('/auth/login', authData)
  .then(response => {
    const { token } = response.data;
    // Include the token in the headers of subsequent requests
    localStorage.setItem('token', response.data.token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return response;
  });

  export const LocalSignin = (authData:{username:string,password:string}) => API.post('/auth/localauthoritylogin', authData)
  .then(response => {
    const { token } = response.data;
    // Include the token in the headers of subsequent requests
    localStorage.setItem('token', response.data.token);
    API.defaults.headers.common['Authorization'] = token;
    return response;
  });

  export const CentralSignin = (authData:{username:string,password:string}) => API.post('/auth/centeraladminlogin', authData)
  .then(response => {
    const { token } = response.data;
    // Include the token in the headers of subsequent requests
    localStorage.setItem('token', response.data.token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return response;
  });

  export const getReportsbyStatus=(status:string)=>API.get(`user/reportstatus/${status}`)

  export const updayeStatus = (reportID:string,data:{status:string})=>API.post(`user/updateReportStatus/${reportID}`,data)
  export const getDetails = (sanctName:string)=>API.get(`data/getyearlydata/${sanctName}`)
  export const getEndangeredSpeciesDetails = (sanctName:string,year:number)=>API.get(`data/getEndangeredSpecies/${sanctName}/${year}`)
  export const getReportByStatus=(status:"pending"|"accepted"|"rejected")=>API.get(`user/reportstatus/${status}`)

  export const getAssignedReports = ()=>API.get(`user/getReportsAssigned`)
  export const AssignedReport = (reportID:string,department:string)=>API.post(`user/assignReport/${reportID}/${department}`)
  export const getAlert = ()=>API.get(`user/recent-user-reports`)
  export const getcaAlert = ()=>API.get(`user/getOverdueReports`)
  export const getAllVisitors = ()=>API.get(`data/get-all-visitors`)
  export const messagesExists = ()=>API.get(`user/messagesExists`)
  export const getUserReports = (userId:string)=>API.get(`user/getuserreports/${userId}`)