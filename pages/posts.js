import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";

export default function Posts() {

  const postContent = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    console.log(querySnapshot)
    return querySnapshot
  };

//   console.log(postContent)
  
  const displayPosts = async () => {
    // console.log("display");

    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data().description)}`);
    });
  };

  return (
    <div>
      <div>
        <button onClick={postContent}> display posts </button>{" "}
        {/* <ul>
          {postContent.forEach((content) => {
            <li>hi</li>
        })}
        </ul> */}
      </div>
    </div>
  );
}
