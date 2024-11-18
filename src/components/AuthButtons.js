import React from "react";
import { Link } from "react-router-dom";

const AuthButtons = ({ isLoggedIn }) => {
  if (isLoggedIn) return null;

  return (
    <div className="fixed top-4 right-4 flex space-x-4">
      <Link
        to="/login"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Register
      </Link>
    </div>
  );
};

export default AuthButtons;
