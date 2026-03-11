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
import { ClerkProvider } from "@clerk/react";
import Hero from "./pages/Hero";

function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn)
    return (
      <div className="min-h-screen font-mono flex items-center justify-center bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 px-4">
        <div className="text-center">
          <p className="text-emerald-800 font-semibold text-lg sm:text-2xl mb-4 animate-fade-in">
            Please sign in to view this page
          </p>

          <div className="flex justify-center">
            <Link
              to="/"
              className="px-4 py-2 text-sm rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md transition-all duration-300 ease-in-out animate-bounce-subtle"
            >
              HOME
            </Link>
          </div>
        </div>
      </div>
    );

  return children;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
    </Routes>
  );
};

export default App;
