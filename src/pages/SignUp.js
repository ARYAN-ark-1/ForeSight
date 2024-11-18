import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify
import { Link } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
        });
      }
      toast.success("User Registered Successfully!!", {
        position: "top-center",
        autoClose: 5000, // Automatically close after 5 seconds
      });
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("The email address is not valid. Please enter a valid email.");
          break;
        case "auth/weak-password":
          setError("The password is too weak. Please use at least 6 characters.");
          break;
        case "auth/email-already-in-use":
          setError("The email address is already in use. Try logging in instead.");
          break;
        case "auth/operation-not-allowed":
          setError("Email/Password authentication is not enabled in Firebase.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
      }
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-nunito">
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Create a CryptoBucks Account
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-500"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-500"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-500"
              placeholder="Enter email"
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={{
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
            }}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="text-cyan-600 hover:underline">
            Login
          </Link>
        </p>
        <Link
          to="/"
          className="absolute top-4 right-4 bg-cyan-500 text-cyan font-semibold px-4 py-2 rounded-md hover:bg-cyan-600 transition duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
