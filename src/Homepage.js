import capture from "./images/Capture.PNG";
import propic from "./images/default.PNG"
import React, {useEffect, useState} from "react";
import App from "./App";
import hp from "./css/hp.css"
import {useHistory} from "react-router-dom";
import firebase from "./firebase.js";
import {Navbar,Nav} from "react-bootstrap";
import Post from "./Post"

const Homepage=(logout)=>{
    const height= window.screen.height;
    const width= window.screen.width;
    const history = useHistory();
    const [posts, setPost] = useState([]);
    const [posttext,setPostText] = useState('')
    const [mydata,setMydata]=useState([]);
    const[myname,setmyName]=useState([]);
    const [user,setUser]=useState('');


    const redirectTochatroomPage = () => {
        history.push("/chatroom")
        }
    const redirectToProfilePage = () => {
        history.push("/profile")
    }
    const redirectToResourcesPage = () => {
        history.push("/resources")
    }
    const redirectToAnnouncementPage = () => {
        history.push("/announcement")
    }
    const redirectToAboutUsPage = () => {
        history.push("/about")
    }

    const signout = () => {
        firebase.auth().signOut().then(()=>{
            //this.store.dispatch('clearData')
            history.push("/Signin");
            }

        );
    }
    //loads when homepage is loads
    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(usr) {
            if (usr) {
                // User is signed in.
                setUser(usr);
                //const image = firebase.storage().ref(`images/${user.uid}`);
            } else {
                // No user is signed in.
                signout()
            }
        })
        //grabs posts items from database and places them in our  post array
        firebase.firestore().collection('posts')
            .orderBy("timestamp","desc")
            .onSnapshot((snapshot) =>{setPost(snapshot.docs.map((doc)=>doc.data()))
            console.log(posts)
        })
},[])

    // var keys=[];
    // var counts=[];
    // var ref = firebase.database().ref().child("Posts").orderByChild('posts');
    // var keys = [];
    // var counts = [];
    // ref.once('value', function (snap) {
    //     snap.forEach(function (item) {
    //         var itemVal = item.val();
    //         keys.push(itemVal);
    //     });
    //     for (var i = 0; i < keys.length; i++) {
    //         counts.push(keys[i].posts);
    //     }
    //     setMydata(counts);
    // })







   //const numbers = ["Hello My name is nick. Looking for roommate near uta", "2", "3", "4","5" ];
   //  const listItems = mydata.map((number) =>
   //
   //      <div className="card px-3 py-4 " style={{marginTop: 20}}>
   //          <h1> Username</h1>
   //          <li>{number}</li>
   //          <ul className="list-group">
   //              <button className="btn float-Center" style={{
   //                  display: 'flex',
   //                  background: "rgb(0,100,177)",
   //                  justifyContent: 'center',
   //                  alignSelf: 'center',
   //                  height: 40,
   //                  width: 200
   //              }}
   //                      onClick={savePost}>Comment
   //              </button>
   //
   //          </ul>
   //      </div>

    //);

    // var uid = user.uid;
    // var date = Math.floor(Date.now() / 1000)
    // var ref = firebase.app().database().ref();
    // var usersRef = ref.child('Posts').child(uid + date);

    const savePost = function (user) {
    console.log(user.photoURL)

        firebase.auth().onAuthStateChanged(function(usr) {
            if (usr) {

                    firebase.firestore().collection('posts').add({
                        post: posttext,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        userimage: usr.photoURL,
                        username: usr.displayName,
                    })
                } else {
                // No user is signed in.
                signout()
            }
        })
        alert("Post successful")
    }


    console.log(posts)




    return (
        <div>
        {user?(
            <div style={{background: "rgb(255,250,250)"}}>
                <nav className="navbar navbar bg-blue" style={{background: "rgb(0,100,177)"}}>
                    <a className="navbar-brand" href="#">
                        <img src={capture} width="60" height="60"/>
                    </a>

                    <div className="topnav" id="myTopnav" style={{width: 800, margin: '0 auto'}}>
                        <a href="/homepage">Home</a>
                        <a onClick={redirectTochatroomPage}>Chatrooms</a>
                        <a onClick={redirectToAnnouncementPage}>Announcement</a>
                        <a onClick={redirectToAboutUsPage}>About Us</a>
                        <a onClick={redirectToResourcesPage}>Resources</a>
                        <a onClick={redirectToProfilePage}>My Account</a>
                        <a onClick={signout}>Logout</a>
                    </div>
                </nav>

                <div className="card px-3 py-4">
                    <div className="container px-3">
                        <label className="mb-1">
                            <h6 className="">Write Something....</h6>
                        </label>
                        <textarea className="mb-4" type="text"
                                  placeholder="Write a post"
                                  onChange={(e) => setPostText(e.target.value)}
                        />
                        <button className="btn float-left" style={{background: "rgb(0,100,177)", alignSelf: "right"}}
                                onClick={savePost}>Post
                        </button>

                    </div>
                </div>

                <div className="card px-3 py-4 " style={{marginTop: 20}}>
                    {posts.map(post =>(
                       <Post
                           username = {post.username}
                           timestamp ={post.timestamp}
                           userImage={post.userimage}
                           post = {post.post}
                      />
                    ))}

                    </div>


            </div>

        ):(<div/>)}

        </div>

    )


}
export default Homepage;
