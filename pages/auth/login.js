import React from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function Login() {
  //sign in with google
  const googleProvider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth);
  const route = useRouter();

  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // console.log(result.user)
      route.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/dashboard");
    } else {
      console.log("login");
    }
  }, [user]);

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-md">
      <h2 className="text-3xl font-medium">Join today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3>
      </div>
      <div className="flex flex-col gap-3">
        {/* <Link className="text-white bg-gray-600 rounded-lg flex align-middle gap-2 p-2 max-w-md mx-auto font-medium"><FcGoogle /> Sign in with Google</Link> */}
        <button
          onClick={GoogleLogin}
          className="text-white bg-gray-600 rounded-lg flex align-middle gap-2 p-2 max-w-md mx-auto font-medium"
        >
          <FcGoogle /> Sign in with Google
        </button>
      </div>
    </div>
  );
}
