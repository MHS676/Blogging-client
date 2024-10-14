import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to handle Google Authentication
const authWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // Retrieve Google credentials and user data
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    return { user, token };
  } catch (error) {
    // Detailed error handling
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email; // The email of the user's account used
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error(
      "Error during Google authentication",
      errorCode,
      errorMessage
    );
    // Optionally display a user-friendly error message in the UI
    throw error;
  }
};

// Export authentication and Google sign-in function
export { auth, authWithGoogle };
