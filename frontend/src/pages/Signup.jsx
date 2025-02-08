//import { Link } from "react-router-dom";

export default function Signup ({ setIsLogin }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-Bg">
            <div className="bg-NavyBlue p-8 rounded-lg shadow-lg w-96 transparent-70%">
            <img src="/Final_logo_white.png" alt="Roamio Logo" className="mx-auto w-24 h-24 mb-2 mt-0" />
            {/*<h2 className="text-2xl font-bold text-center text-darkBlue mb-4">Sign Up for Roamio</h2>*/}

                <form>
                    <label className="block text-sm font-medium text-white">Full Name</label>
                    <input type="text" placeholder="Enter your full name" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-Teal mb-2" />

                    <label className="block text-sm font-medium text-white">Username</label>
                    <input type="password" placeholder="Enter a username" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-Teal mb-2" />

                    <label className="block text-sm font-medium text-white">Email</label>
                    <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-Teal mb-2" />

                    <label className="block text-sm font-medium text-white">Password</label>
                    <input type="password" placeholder="Create a password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-Teal mb-2" />

                    <label className="block text-sm font-medium text-white">Date of Birth</label>
                    <input type="date" placeholder="YYYY-MM-DD" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-Teal mb-2" />

                    <label className="block text-sm font-medium text-white">Location</label>
                    <select type="location" placeholder="Select your option" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-Teal mb-2" />

                    <button className="w-full bg-Teal text-white py-2 px-4 rounded-md hover:bg-opacity-80 mt-3">
                      Sign Up
                    </button>
                </form>

                {/*<p className="text-sm text-center text-white mt-4">
                    Already have an account? <Link to="/" className="text-Teal hover:underline">Login</Link>
                </p>
                <button
                  className="w-full bg-Teal text-white py-2 px-4 rounded-md hover:bg-opacity-80 mt-3"
                  onClick={() => setIsLogin(true)}
                >
                  Go to Login
                </button>*/}
                <div className="flex items-center justify-center mb-4 mt-4">
                    <span className="text-white mr-2">Login</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" className="sr-only peer" onChange={() => setIsLogin(true)} checked
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-Teal rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-Teal"></div>
                    </label>
                    <span className="text-white ml-2">Sign Up</span>
                </div>

            </div>
        </div>
    );
}