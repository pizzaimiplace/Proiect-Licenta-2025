import { jwtDecode } from "jwt-decode"
import { Navigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { useState, useEffect } from "react"

import Api from "../Api"

function ProtectedRoute({ children }){
    const [isAuth, setIsAuth] = useState(null);

    const refresh = async () => {
        const token = localStorage.getItem(REFRESH_TOKEN);
        try{
            const response = await Api.post("/api/token/refresh/",{refresh: token});
            localStorage.setItem(ACCESS_TOKEN, response.data.access)
            setIsAuth(true);
        } catch(error){
            setIsAuth(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            setIsAuth(false);
            return;
        }
        try {
            const decodedToken = jwtDecode(token);
            const expiration = decodedToken.exp;
            const nowInSec = Date.now() / 1000;

            if(expiration < nowInSec){
                await refresh();
            }
            else{
                setIsAuth(true);
            }
        } catch {
            setIsAuth(false);
        }
    }

    useEffect(() => {
        auth();
    }, []);

    if (isAuth === null) {
        return <p>Loading...</p>;
    }
       
    return isAuth ? children : < Navigate to="/login" />
}

export default ProtectedRoute;