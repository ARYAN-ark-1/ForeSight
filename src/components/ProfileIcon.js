import React, { useState } from "react";
import { auth } from "../pages/firebase"; // Import your Firebase setup

const ProfileIcon = ({ userDetails }) => {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="relative">
      {/* Profile Icon - Light color circle */}
      <div
        className="fixed top-4 right-4 bg-gray-200 text-black rounded-full flex items-center justify-center w-12 h-12 shadow-lg cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out"
        onClick={() => setShowLogout((prev) => !prev)}
      >
        <span className="text-pink font-bold text-xl">
          {userDetails.firstName.charAt(0)}
        </span>
      </div>

      {/* Logout Button - Positioned below the profile icon */}
      {showLogout && (
        <div className="fixed top-16 right-4 w-24">
          <p className="bg-red-500 text-cyan py-2 rounded-md shadow-md hover:bg-red-600 w-full text-center transition duration-200">Name : {userDetails.firstName} {userDetails.lastName}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-cyan py-2 rounded-md shadow-md hover:bg-red-600 w-full text-center transition duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
