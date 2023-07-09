import { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  OAuthProvider,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { app } from "./Firebase";
import { addUpdateUser, getSelf } from "./Database";

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");
const auth = getAuth(app);

type UserPasswordCredentials = {
  email: string;
  password: string;
};

export const createUserPassword = ({
  email,
  password,
}: UserPasswordCredentials): Promise<boolean> => {
  return new Promise(function (resolve, reject) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential) {
          addUpdateUser(userCredential)
            .then(() => {
              sendEmailVerification(userCredential.user).then(() => {
                resolve(true);
              });
            })
            .catch(() => reject(false));
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        resolve(errorCode);
      });
  });
};

export const signInUserPassword = ({
  email,
  password,
}: UserPasswordCredentials): Promise<boolean | any> => {
  return new Promise(function (resolve, reject) {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        addUpdateUser(user)
          .then(() => resolve(true))
          .catch(() => reject(false));
        resolve(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        reject(errorCode);
      });
  });
};

export const googleLogin = (): Promise<boolean | any> => {
  return new Promise(function (resolve, reject) {
    signInWithPopup(auth, googleProvider)
      .then((user) => {
        if (user) {
          addUpdateUser(user)
            .then(() => resolve(true))
            .catch(() => reject(false));
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        resolve(false);
      });
  });
};

export const microsoftLogin = (): Promise<boolean | any> => {
  return new Promise(function (resolve, reject) {
    signInWithPopup(auth, microsoftProvider)
      .then((user) => {
        if (user) {
          addUpdateUser(user)
            .then(() => resolve(true))
            .catch(() => reject(false));
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        resolve(false);
      });
  });
};

export const adios = () => {
  signOut(auth);
};

export const useAuthListener = (): any => {
  const [authenticated, setAuthenticated] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checkingAuthentication, setCheckingAuthentication] = useState(true);
  const [user, setUser] = useState<User>();
  const [userUID, setUserUID] = useState("");
  const [teamUID, setTeamUID] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (
          user.providerData[0].providerId === "password" &&
          user.emailVerified === false
        ) {
          setVerified(false);
        }
        setVerified(true);
        setUser(user);
        setUserUID(user.uid);
        setAuthenticated(true);
        setCheckingAuthentication(false);
        getSelf(user.uid)
          .then((self) => {
            setTeamUID(self.teamUID);
          })
          .catch(() => {
            setAuthenticated(false);
          });
      } else {
        setAuthenticated(false);
        setCheckingAuthentication(false);
      }
    });
  }, []);

  return {
    authenticated,
    checkingAuthentication,
    userUID,
    teamUID,
    verified,
    user,
  };
};
