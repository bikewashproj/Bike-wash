// // import { useState } from "react";

// // export default function Userlogin() {
// //   const [isLogin, setIsLogin] = useState(true);

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
// //         <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
// //           {isLogin ? "Login" : "Sign Up"}
// //         </h2>
// //         <form className="space-y-4">
// //           {!isLogin && (
// //             <input
// //               type="text"
// //               placeholder="Full Name"
// //               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
// //             />
// //           )}
// //           <input
// //             type="email"
// //             placeholder="Email Address"
// //             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
// //           />
// //           <input
// //             type="password"
// //             placeholder="Password"
// //             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
// //           />
// //           <button
// //             type="submit"
// //             className="w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
// //           >
// //             {isLogin ? "Login" : "Sign Up"}
// //           </button>
// //         </form>
// //         <p className="mt-4 text-center text-gray-600">
// //           {isLogin ? "Don't have an account?" : "Already have an account?"} 
// //           <button
// //             className="text-blue-500 hover:underline ml-2"
// //             onClick={() => setIsLogin(!isLogin)}
// //           >
// //             {isLogin ? "Sign Up" : "Login"}
// //           </button>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // // }
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LoginForm({ isLogin }) {
  return (
    
    <form className="space-y-4">
      {!isLogin && (
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      )}
      <input
        type="email"
        placeholder="Email Address"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}

export default function UserLogin() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    

    <div className="min-h-screen flex flex-col ">
      
    <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
     
      <div className="pt-16 flex-grow ">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-16 py-8 ">
      
      <div className="w-full max-w-md p-8 bg-black rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white -700 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <LoginForm isLogin={isLogin} />
        <p className="mt-4 text-center text-white -600">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <button
            className="text-blue-500 hover:underline ml-2"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
      
    </div>
    </div>
    </div>
    <Footer />
</div>
    
  );
}

// import { useState } from "react";

// function LoginForm({ isLogin }) {
//   return (
//     <form className="space-y-4">
//       {!isLogin && (
//         <input
//           type="text"
//           placeholder="Full Name"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       )}
//       <input
//         type="email"
//         placeholder="Email Address"
//         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />
//       <button
//         type="submit"
//         className="w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//       >
//         {isLogin ? "Login" : "Sign Up"}
//       </button>
//     </form>
//   );
// }

// export default function UserLogin() {
//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <div
//       className="flex items-center justify-center min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x900/?technology')" }}
//     >
//       <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-lg backdrop-blur-md">
//         <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
//           {isLogin ? "Login" : "Sign Up"}
//         </h2>
//         <LoginForm isLogin={isLogin} />
//         <p className="mt-4 text-center text-gray-600">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//           <button
//             className="text-blue-500 hover:underline ml-2"
//             onClick={() => setIsLogin(!isLogin)}
//           >
//             {isLogin ? "Sign Up" : "Login"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }
