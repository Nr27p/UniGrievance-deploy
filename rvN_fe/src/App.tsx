import React, { Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SpinnerCircular from "./components/ui/SpinnerCircular";
import { Toaster } from "react-hot-toast";
import { useProfileStore } from "./store/store";
import LiveChat from "./Pages/LiveChat";
// require('dotenv').config();


const HomePage = React.lazy(()=>import('./Pages/Homepage'))
const Signin = React.lazy(()=>import('./Pages/Signin')) 
const AuthSignin = React.lazy(()=>import('./Pages/AuthSignin'))
const CentralSignin = React.lazy(()=>import('./Pages/CentralSignin'))
const Signup = React.lazy(()=>import('./Pages/Signup'))
const Dashboard = React.lazy(()=>import('./Pages/DashBoard'))
const Maps = React.lazy(()=>import('./Pages/Maps'))
const Charts = React.lazy(()=>import('./Pages/Charts'))
const Report = React.lazy(()=>import('./Pages/Report'))
const Case = React.lazy(()=>import('./Pages/Cases'))
const Visitors = React.lazy(()=>import('./Pages/Visitor'))
const InvestigatorDash = React.lazy(()=>import('./Pages/centraladmindash'))
const Explore = React.lazy(()=>import('./Pages/Explore'))
const Alerts = React.lazy(()=>import('./Pages/Alerts'))
const CaAlerts = React.lazy(() => import("./Pages/CaAlerts"));
const UserCases = React.lazy(()=>import('./Pages/UserCases'))
const Live = React.lazy(()=>import('./Pages/LiveChat'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/auth-signin",
    element: <AuthSignin/>,
  },
  {
    path: "/central-signin",
    element: <CentralSignin/>,
  },
  {
    path: "/signin",
    element: <Signin/>,
  },
  {
    path: "/signup",
    element: <Signup/>,
  },
  {
    path: "/dash",
    element: <Dashboard/>,
    children:[
      {
        path:"maps",
        element:<Maps/>
      },
      {
        path:"charts",
        element:<Charts/>
      },
      {
        path:"report",
        element:<Report/>
      },
      {
        path:"cases",
        element:<Case/>
      },
      {
        path:"visitors",
        element:<Visitors/>
      },
      {
        path:"explore",
        element:<Explore/>
      },
      {
        path:"all-cases",
        element:<InvestigatorDash/>
      },
      {
        path:"alerts",
        element:<Alerts/>
      },
      {
        path:"caAlerts",
        element:<CaAlerts/>
      },
      {
        path:"chat/:userId",
        element:<LiveChat/>
      },
      {
        path:"my-reported-cases",
        element:<UserCases/>
      }
      
    ]
  },

])
const App = () => {
  const setUser = useProfileStore((state)=>state.setUser)
  useEffect(() => {
    // Check if Profile exists in localStorage
    const profileData = localStorage.getItem('Profile');
    console.log(profileData)
    if (profileData) {
      // If exists, parse the JSON string and set the user
      const { token, role,userId } = JSON.parse(profileData);
      setUser({ token, role, userId });
    }
  }, [setUser]);

  return (
    <Suspense fallback={<SpinnerCircular/>}>
    <RouterProvider router={router} />
    <Toaster />
   </Suspense>
  )
}

export default App
