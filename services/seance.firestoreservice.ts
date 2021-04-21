import firebase from "firebase/app";
import "firebase/firestore";

//service pour interragir avec la collection Seance de firabse

//définition d'un seance
export interface Seance {
  id: string;
  nom: string;
  description: string;
  id_semaine: string;
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

class SeanceFirestoreService {
  constructor() {
    //firebase.initializeApp(firebaseconfig);
  }

  //ajouter une seance en bdd
  addSeance(seance: Seance): Promise<firebase.firestore.DocumentReference> {
    return firebase.firestore().collection("Seance").add(seance);
  }

  //supprimer une seance de la bdd
  removeSeance(id: string): Promise<void> {
    return firebase.firestore().collection("Seance").doc(id).delete();
  }

  //recuperer toutes les seabces de la bdd
  getSeances(): Promise<Array<Seance>> {
    return firebase
      .firestore()
      .collection("Seance")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((d) => {
          return { ...d.data(), ...{ id: d.id } } as Seance;
        });
      });
  }

  //recuperer une seance en particulier grace a son id
  getSeancesById(idSeance: string): Promise<Seance> {
    return firebase
      .firestore()
      .collection("Seance")
      .doc(idSeance)
      .get()
      .then((querySnapshot) => {
        return {
          ...querySnapshot.data(),
          ...{ id: querySnapshot.id },
        } as Seance;
      });
  }

  //recuperer toutes les seances en bdd
  listenSeances(onSeancesChange: (seances: Array<Seance>) => void): () => void {
    return firebase
      .firestore()
      .collection("Seance")
      .onSnapshot((querySnapshot) => {
        onSeancesChange(
          querySnapshot.docs.map(
            (d) => ({ ...d.data(), ...{ id: d.id } } as Seance)
          )
        );
      });
  }

  //recuperer toutes les seances correspondant a une semaine en particulier grace à l'id de la semaine
  getSeancesFromSemaine(idSemaine: string): Promise<Array<Seance>> {
    return firebase
      .firestore()
      .collection("Seance")
      .where("id_semaine", "==", idSemaine)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((d) => {
          return { ...d.data(), ...{ id: d.id } } as Seance;
        });
      });
  }
}

export default new SeanceFirestoreService();
