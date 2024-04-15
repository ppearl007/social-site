import Message from "@/components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  updateDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { getComponentTypeModule } from "next/dist/server/lib/app-dir-module";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  // submit a message
  const submitMessage = async () => {
    // check if user is logged in
    if (!auth.currentUser) return router.push("/auth/login");

    if (!message) {
      toast.error("Dont leave an empty message", {
        // position: toast.POSITION.TOP_CENTER,
        // autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };

  //   Get comments

  // use await getdoc to get it once - needs refresh
  // use snapshot to get messages realtime
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const docSnap = await getDoc(docRef);
    setAllMessages(docSnap.data().comments);
    console.log(allMessages);
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}> </Message>
      <div>
        <div>
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Send a message"
            className="bg-gray-800 w-full p-2 text-sm"
          />
          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold text-black">Comments</h2>
          {allMessages.map((message) => (
            <div className="bg-white p-4 my-4 border-2">
              <div className="text-sm flex items-center gap-2 mb-4">
                <img className="w-10 rounded-full" src={message.avatar} alt="" />
                <p className="text-black">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
