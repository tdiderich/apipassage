import { v4 as uuidv4 } from 'uuid';
import {
  getFirestore,
  collection,
  setDoc,
  getDoc,
  doc,
  where,
  getDocs,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { UserCredential } from 'firebase/auth';
import { app } from './Firebase';

const db = getFirestore(app);

export type User = {
  userUID: string;
  email: string;
};

export type CredentialType = {
  name: string;
  type: 'virus-total' | 'ip-info' | 'runzero';
  apiKey: string;
  userUID: string;
  teamUID: string | null;
  integrationUID: string | null;
};

type TeamUser = {
  userUID: string;
  role: string;
};

export type TeamType = {
  name: string;
  ownerUID: string;
  teamUID: string | undefined;
  subscription: 'trial' | 'team' | 'enterprise';
  userList: string[];
  users: TeamUser[];
};

export const addUpdateUser = async (auth: UserCredential): Promise<any> => {
  return new Promise(function (resolve, reject) {
    setDoc(
      doc(db, 'users', auth.user.uid),
      {
        email: auth.user.email,
        name: auth.user.displayName,
        lastLogin: serverTimestamp(),
        active: true,
        subscription: 'free',
        userUID: auth.user.uid,
        teams: ['personal']
      },
      { merge: true }
    ).then(() => {
      getSelf(auth.user.uid).then((self) => {
        resolve(self);
      });
    });
  });
};

export const getSelf = (userUID: string): Promise<User | any> => {
  return new Promise(function (resolve, reject) {
    getDoc(doc(db, 'users', userUID))
      .then((doc) => {
        if (doc.exists()) {
          resolve(doc.data());
        } else {
          reject('No data available');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createOrUpdateCredential = ({
  name,
  type,
  apiKey,
  userUID,
  teamUID,
  integrationUID
}: CredentialType): Promise<any> => {
  return new Promise(function (resolve, reject) {
    let id = integrationUID || uuidv4();
    setDoc(doc(db, 'credentials', id), {
      name: name,
      type: type,
      apiKey: apiKey,
      integrationUID: id,
      userUID: userUID,
      teamUID: teamUID || ''
    })
      .then(() => resolve(integrationUID))
      .catch((error) => reject(error));
  });
};

export const getCredentials = async (userUID: any): Promise<any> => {
  return new Promise(function (resolve, reject) {
    getDocs(
      query(collection(db, 'credentials'), where('userUID', '==', userUID))
    ).then((docs) => {
      if (docs.size > 0) {
        let temp: any = [];
        docs.forEach((doc) => {
          temp.push(doc.data());
        });
        resolve(temp);
      } else {
        resolve([]);
      }
    });
  });
};

export const getCredential = async (integrationUID: any): Promise<any> => {
  return new Promise(function (resolve, reject) {
    getDoc(doc(db, 'credentials', integrationUID))
      .then((doc) => {
        if (doc.exists()) {
          resolve(doc.data());
        } else {
          reject('No data available');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getTeam = (teamUID: string): Promise<any> => {
  return new Promise(function (resolve, reject) {
    getDoc(doc(db, 'teams', teamUID))
      .then((doc) => {
        if (doc.exists()) {
          resolve(doc.data());
        } else {
          reject('No data available');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const addTeam = async (team: TeamType): Promise<any> => {
  return new Promise(function (resolve, reject) {
    let id = team.teamUID || uuidv4();
    setDoc(
      doc(db, 'teams', id),
      {
        name: team.name,
        subscription: team.subscription,
        ownerUID: team.ownerUID,
        userList: team.userList,
        users: team.users,
        teamUID: id
      },
      { merge: true }
    ).then(() => {
      getTeam(id)
        .then((team) => {
          resolve(team);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

export const updateTeam = async (team: TeamType): Promise<any> => {
  return new Promise(function (resolve, reject) {
    if (team.teamUID) {
      setDoc(
        doc(db, 'teams/', team.teamUID),
        {
          name: team.name,
          subscription: team.subscription,
          users: team.users
        },
        { merge: true }
      )
        .then((team) => {
          resolve(team);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject('teamUID required to update team');
    }
  });
};

export const getTeams = async (userUID: any): Promise<any> => {
  return new Promise(function (resolve, reject) {
    getDocs(
      query(
        collection(db, 'teams'),
        where('userList', 'array-contains', userUID)
      )
    ).then((docs) => {
      if (docs.size > 0) {
        let temp: any = [];
        docs.forEach((doc) => {
          temp.push(doc.data());
        });
        resolve(temp);
      } else {
        resolve([]);
      }
    });
  });
};
