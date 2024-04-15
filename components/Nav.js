import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import logo from "../public/logo.png";

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  // console.log(user)

  return (
    <nav className="flex justify-between items mt-5">
      <Link href={"/"}>
        <Image className="w-10 full" src={logo} alt="logo"/>
      </Link>
      <ul>
        {!user ? (
          <Link
            href={"/auth/login"}
            className="text-white py-2 px-4 text-lg bg-teal-400 rounded-md"
          >
            Join now
          </Link>
        ) : (
          <div className="flex items-center gap-5">
            <Link href={"/post"} className="font-medium text-sm bg-cyan-500 text-white p-2">Post</Link>
            <Link href={"/dashboard"}>{user.displayName}</Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
