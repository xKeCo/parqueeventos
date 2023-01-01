// React
import { useContext } from "react";

// Context
import { Context } from "../context/AppContext";

// React Hot Toast Notification
import { toast } from "react-hot-toast";
import { errorConfigTop } from "../config/toastConfig";

// Firebase
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  getAuth,
  signOut as signOutAuth,
} from "firebase/auth";
import { app } from "../config/firebase";

const useAuth = () => {
  const { user, loadingUser } = useContext(Context);
  const auth = getAuth(app);

  const googleAuth = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      toast.error(error.message, errorConfigTop);
    }
  };

  const facebookAuth = async () => {
    try {
      const facebookProvider = new FacebookAuthProvider();
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      toast.error(error.message, errorConfigTop);
    }
  };

  const signOut = async () =>
    await signOutAuth(auth).catch((error) =>
      toast.error(error.message, errorConfigTop)
    );

  return {
    user,
    loadingUser,
    googleAuth,
    facebookAuth,
    signOut,
  };
};

export default useAuth;
