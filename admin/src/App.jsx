// import React from 'react'
// const App =() =>{
//   return(
//    <Routes>
//     <Route path= '/' element={<Hero/>}/>
//     </Routes>
//   )
// }
// export default App





import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ClerkProvider, useUser } from "@clerk/react";
import Hero from "./pages/Hero";



function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn)
    return (
      <div className="min-h-screen font-mono flex items-center justify-center bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 px-4">
        <div className="text-center">
          <p className="text-emerald-800 font-semibold text-lg sm:text-2xl mb-4">
            Please sign in to view this page
          </p>

          <Link
            to="/"
            className="px-4 py-2 text-sm rounded-full bg-emerald-600 text-white"
          >
            HOME
          </Link>
        </div>
      </div>
    );

  return children;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/h" element={<RequireAuth>
        <Home/>
      </RequireAuth>}
      />
      <Route path="/add" element={<RequireAuth>
        <Add/>
      </RequireAuth>}/>
      <Route path="/list" element={<RequireAuth>
        <List/>
      </RequireAuth>}
      />
      <Route path="/appointments" element={<RequireAuth>
        <Appointments/>
      </RequireAuth>}
      />
       <Route path="/service-dashboard" element={<RequireAuth>
        <SerDashboard/>
      </RequireAuth>}
      />
       <Route path="/add-service" element={<RequireAuth>
        <AddSer/>
      </RequireAuth>}
      />
       <Route path="/list-service" element={<RequireAuth>
        <ListService/>
      </RequireAuth>}
      />

 <Route path="/service-appointments" element={<RequireAuth>
        <serviceappointments/>
      </RequireAuth>}
      />
    </Routes>
  );
};

export default App;
