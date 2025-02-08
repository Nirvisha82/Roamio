import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function ToggleAuth() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-Bg">
            {isLogin ? <Login setIsLogin={() => setIsLogin(false)} /> : <Signup setIsLogin={() => setIsLogin(true)} />}
        </div>
    );
}
