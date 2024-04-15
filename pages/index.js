import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import Message from "@/components/message";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    // const collectionRef = await getDocs(collection(db, "posts"));
    // const q = query(collectionRef, orderBy('timestamp', 'desc'))   // added to filter/order the query
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   setAllPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    // })

    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${JSON.stringify(doc.data().description)}`);
      setAllPosts(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    console.log(allPosts);
    // return unsubscribe
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>Welcome to my Webpage</h1>
      <div className="my-12 txt-lg font-medium">
        <Link href={"/dashboard"}>Go to dashboard</Link>
        {/* <h2>See what others are saying</h2> */}
        <Message />
        <button onClick={getPosts}>Past Posts</button>
        {allPosts.map((post) => (
          <Message {...post} key={post.id}>
            <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
              <button className="text-black text-sm bg-green-400">
                {" "}
                {post.comments?.length > 0 ? post.comments?.length : 0} comments
              </button>
            </Link>
          </Message>
        ))}
      </div>
    </main>
  );
}
