import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/utils/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  //Form state
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);

  const route = useRouter();
  const routeData = route.query;

  //Submit post
  const submitPost = async (e) => {
    e.preventDefault(); // prevents page refresh after button click

    // console.log(post.description);

    // run checks for description and return error if empty
    if (!post.description) {
      toast.error("description field empty!"),
        {
          position: toast.position,
        };
      return;
    }

    if (routeData.id) {
    // update existing post
      const docRef = doc(db, "posts", post.id);
    //   console.log(docRef);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/dashboard")
    } else {
      // Make a new post

      const collectionRef = collection(db, "posts"); //reference to collection
      // console.log(db)
      //add a doc to the reference
      try {
        await addDoc(collectionRef, {
          ...post,
          timestamp: serverTimestamp(),
          user: user.uid,
          avatar: user.photoURL,
          username: user.displayName,
        });
        console.log(db);
      } catch (e) {
        console.error(e);
      }
      setPost({ description: "" });
      return route.push("/dashboard");
    }
  };

  // check user
  // also check to see if data is a new input or if its coming from firebase
  // by checking if the data has an id which comes from firebase

  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        {routeData.id ? (
          <h1 className="text-2xl font-bold">Update Post</h1>
        ) : (
          <h1 className="text-2xl font-bold">Create a new post</h1>
        )}
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            className=" h-48 w-full rounded-lg p-2 text-sm bg-gray-600"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
          ></textarea>
          {/* <textarea className="bg-gray-600 h-48 w-full text-white rounded-lg p-2 text-sm"></textarea> */}
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 && "text-red-600"
            }`}
          >
            {post.description.length}/300
          </p>
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
          >
            Submit
          </button>
          {/* <Link href={"/auth/login"} /> Submit<Link/> */}
        </div>
      </form>
    </div>
  );
}
