import { useState, useEffect } from 'react';
// Firebase dependencies.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Button from './components/Button';
import Channel from './components/Channel';

firebase.initializeApp({
  apiKey: "AIzaSyDaY3tZlhQ0UWpfFMtGmD4d88IORjBZWyI",
  authDomain: "poweigel-react-firechat.firebaseapp.com",
  projectId: "poweigel-react-firechat",
  storageBucket: "poweigel-react-firechat.appspot.com",
  messagingSenderId: "265336813281",
  appId: "1:265336813281:web:f4df88b38610783c52a9a0"
});

const auth = firebase.auth();

function App() {
  const db = firebase.firestore();
  const [ user, setUser ] = useState(() => auth.currentUser);
  const [ initializing, setInitializing ] = useState(true);

  useEffect(() => {
    // Receive an event whenever the user's authentication state changes.
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    })

    // Cleanup subscription.
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    // Retrieve Google provider object.
    const provider = new firebase.auth.GoogleAuthProvider();
    // Set language to the default browser language.
    auth.useDeviceLanguage();
    // Start sign in process.
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  }

  // Setup a sign out button for the user.
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error);
    }
  };

  // Because listner is asynchronous, need an 'initializing' state to block our
  // main application from rendering while our connection is established.
  if (initializing) return "Loading...";

  return (
    <div>
      {user ? (
        <>
          <Button onClick={signOut}>Sign Out</Button>
          <Channel user={user} db={db} />
        </>
      ) : (
        <Button onClick={signInWithGoogle}>Sign In with Google</Button>
      )}
    </div>
  );
}

export default App;
