//import { Link } from "react-router-dom";

export default function Login({ setIsLogin }) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-Bg">
        <div className="bg-NavyBlue p-8 rounded-lg shadow-lg w-96">
          <img src="/Final_logo_white.png" alt="Roamio Logo" className="mx-auto w-24 h-24 mb-2" />
          {/*<h2 className="text-2xl font-bold text-white text-center mb-6">Login to Roamio</h2>*/}
  
          <form>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-Teal"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-Teal"
              />
            </div>
  
            <button className="w-full bg-Teal text-white py-2 px-4 rounded-md hover:bg-opacity-80 mt-3">
              Login
            </button>
          </form>
  
          {/*<p className="text-sm text-center text-white mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-Teal hover:underline">Sign Up</Link>
            </p>*/}
          <div className="flex items-center justify-center mb-4 mt-4">
            <span className="text-white mr-2">Login</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" className="sr-only peer" onChange={() => setIsLogin(false)}/>
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-Teal rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-Teal"></div>
            </label>
            <span className="text-white ml-2">Sign Up</span>
          </div>
        </div>
      </div>
    );
  }  