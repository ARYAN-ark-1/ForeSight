import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import SignInwithGoogle from "./signInWithGoogle";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully", {
        position: "top-center",
      });
      window.location.href = "/"; 
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#167bff",
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0d66cc",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-nunito">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h3 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid mb-4">
            <button 
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
            >
              Submit
            </button>
          </div>

          <p className="text-center mb-4">
            New user <Link to="/SignUp" className="text-cyan-600 hover:underline">Register Here</Link>
          </p>
          <SignInwithGoogle />
        </form>
        <Link to="/" className="absolute top-4 right-4 bg-cyan-500 text-cyan font-semibold px-4 py-2 rounded-md hover:bg-cyan-600 transition duration-200">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;
