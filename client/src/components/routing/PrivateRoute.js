import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";

function PrivateRoute() {
	const authContext = useContext(AuthContext);
	const { isAuthenticated, loading } = authContext;
	return !isAuthenticated && !loading ? <Navigate to="/login" /> : <Outlet />;
}

export default PrivateRoute;
