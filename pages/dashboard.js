import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/utils/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import { collection, doc, deleteDoc, onSnapshot, query, where } from "firebase/firestore"
import Message from "@/components/message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

export default function dashboard() {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([])
  const route = useRouter();
  console.log(user);

//   async operation to see if user is logged in 

  const getData = async () => {
    if (loading) return <h1>Loading..</h1>;
    if (!user) route.push("/auth/login");
    const collectionRef = collection(db, 'posts')
    const q = query(collectionRef, where('user', '==', user.uid)) 
    const unsubscribe = onSnapshot(q, snapshot => {setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))})
    return unsubscribe
  };
  
  //Delete Post
  const deletePost = async (id) => {
    const docRef = doc(db, 'posts', id)
    await deleteDoc(docRef)
  }


  // should be able to use useeffect instead of if statements?
  // the state of auth is defined above and then the variables are watched in useEffect

  useEffect(() => {
    // console.log(`useEffect user ${user}`)
    getData();
  }, [user, loading]);

  if (user) {
    return (
      <div>
        <h1>Welcome to your dashboard, {user.displayName} </h1>
        <h1>Your Posts</h1>
        {/* <div><button onClick={displayPosts}> </button> </div> */}
        <div><Link href={"/posts"}> Posts </Link> </div>

        {posts.map(post => 
          <Message {...post} key ={post.id}>
            <div className="flex gap-4">
              <button onClick={() => deletePost(post.id)} className="text-pink-600 flex items-center justify-center gap-2 py-2 text-small">Delete <BsTrash2Fill className="text-2xl" /></button>
              <Link href={{ pathname: '/post', query:post }}><button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-small">Edit <AiFillEdit /></button></Link>
              
              
            </div>
          </Message>)}

        <button
          className="bg-red-400 py-1 px-2 rounded-md mt-5"
          onClick={() => {
            auth.signOut();
          }}
        >
          Sign out
        </button>
      </div>
    );
  }
  // else {route.push("/auth/login")}
}
