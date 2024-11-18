import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import Navigation from "../components/Navigation";
import { CryptoProvider } from "../context/CryptoContext";
import { StorageProvider } from "../context/StorageContext";
import { TrendingProvider } from "../context/TrendingContext";
import AuthButtons from "../components/AuthButtons";
import ProfileIcon from "../components/ProfileIcon";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import ChatbotIcon from "../components/ChatbotIcon";

const Home = () => {
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("User data not found");
        }
      } else {
        setUserDetails(null); // Clear user data on logout
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <CryptoProvider>
      <TrendingProvider>
        <StorageProvider>
          <main className="w-full h-full flex flex-col items-center relative text-white font-nunito">
            <div className="w-screen h-screen bg-gray-300 fixed -z-10" />
            <Logo />
            <Navigation />
            <AuthButtons isLoggedIn={!!userDetails} />
            {userDetails && <ProfileIcon userDetails={userDetails} />}
            <Outlet />
            <ChatbotIcon />
          </main>
        </StorageProvider>
      </TrendingProvider>
    </CryptoProvider>
  );
};

export default Home;
