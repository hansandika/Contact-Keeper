import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const authContext = useContext(AuthContext);
	const { loadUser, login, error, clearErrors, isAuthenticated } = authContext;
	const alertContext = useContext(AlertContext);
	const { setAlert } = alertContext;

	const navigate = useNavigate();

	const [user, setUser] = useState({
		email: "",
		password: "",
	});

	const { email, password } = user;

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
			loadUser();
		}

		if (error === "Invalid Creential") {
			setAlert(error, "danger");
			clearErrors();
		}
		// eslint-disable-next-line
	}, [isAuthenticated, error]);

	const onChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const onSubmit = (e) => {
		e.preventDefault();

		if (email === "" || password === "") {
			setAlert("Please fill in all fields", "danger");
		} else {
			login({ email, password });
		}
	};

	return (
		<div className="form-container">
			<h1>
				Account <span className="text-primary">Login</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email Address</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={onChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={onChange}
						required
					/>
				</div>
				<input
					type="submit"
					value="Login"
					className="btn btn-primary btn-block"
				/>
			</form>
		</div>
	);
};

export default Login;
