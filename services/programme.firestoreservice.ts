import firebase from "firebase/app";
import "firebase/firestore";

//service pour interragir avec la collection programme de firabse

//defintion d'un programme
export interface Programme {
  id: string;
  name: string;
  description: string;
  imageURL: string;
}

const firebaseconfig = {
  apiKey: "AIzaSyDpGnkJzDR7YBJ4-CFMgfCzXS0d6negzHU",
  authDomain: "pocketcoach-384d9.firebaseapp.com",
  databaseURL: "https://pocketcoach-384d9-default-rtdb.firebaseio.com",
  projectId: "pocketcoach-384d9",
  storageBucket: "pocketcoach-384d9.appspot.com",
  messagingSenderId: "612558053724",
  appId: "1:612558053724:web:c4c61fafec782084b3e199",
};

class ProgrammeFirestoreService {
  constructor() {
    //firebase.initializeApp(firebaseconfig);
  }

  //ajouter un programme en base de donnée
  addProgramme(
    programme: Programme
  ): Promise<firebase.firestore.DocumentReference> {
    return firebase.firestore().collection("Programme").add(programme);
  }

  //supprimer un programme en base de donnée
  removeProgramme(id: string): Promise<void> {
    return firebase.firestore().collection("Programme").doc(id).delete();
  }

  //recupérer les programmes de la base de données
  getProgrammes(): Promise<Array<Programme>> {
    return firebase
      .firestore()
      .collection("Programme")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((d) => {
          return { ...d.data(), ...{ id: d.id } } as Programme;
        });
      });
  }

  //recupérer un programme en particulier grace à son id
  getProgrammeById(idProgramme: string): Promise<Programme> {
    return firebase
      .firestore()
      .collection("Programme")
      .doc(idProgramme)
      .get()
      .then((querySnapshot) => {
        return {
          ...querySnapshot.data(),
          ...{ id: querySnapshot.id },
        } as Programme;
      });
  }

  //récuperer tous les programmes en base de donnée
  listenProgrammes(
    onProgrammesChange: (programmes: Array<Programme>) => void
  ): () => void {
    return firebase
      .firestore()
      .collection("Programme")
      .onSnapshot((querySnapshot) => {
        onProgrammesChange(
          querySnapshot.docs.map(
            (d) => ({ ...d.data(), ...{ id: d.id } } as Programme)
          )
        );
      });
  }
}

export default new ProgrammeFirestoreService();
