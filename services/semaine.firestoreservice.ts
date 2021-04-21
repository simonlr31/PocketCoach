import firebase from "firebase/app";
import "firebase/firestore";

//service pour interragir avec la collection Semaine de firabse

//definition d'une semaine
export interface Semaine {
  id: string;
  nom: string;
  id_programme: string;
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

class SemaineFirestoreService {
  constructor() {
    //firebase.initializeApp(firebaseconfig);
  }

  //ajout d'une semaien en bdd
  addSemaine(semaine: Semaine): Promise<firebase.firestore.DocumentReference> {
    return firebase.firestore().collection("Semaine").add(semaine);
  }

  //suppression d'une semaine en bdd
  removeSemaine(id: string): Promise<void> {
    return firebase.firestore().collection("semaine").doc(id).delete();
  }

  //recuperer toutes les semaines en bdd
  getSemaines(): Promise<Array<Semaine>> {
    return firebase
      .firestore()
      .collection("Semaine")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((d) => {
          return { ...d.data(), ...{ id: d.id } } as Semaine;
        });
      });
  }

  //recuperer toutes les semaines en bdd
  listenSemaines(
    onSemainesChange: (semaines: Array<Semaine>) => void
  ): () => void {
    return firebase
      .firestore()
      .collection("Semaine")
      .onSnapshot((querySnapshot) => {
        onSemainesChange(
          querySnapshot.docs.map(
            (d) => ({ ...d.data(), ...{ id: d.id } } as Semaine)
          )
        );
      });
  }

  //reucperer toutes les semaines d'un programme grace à l'id du programme
  getSemainesFromProgramme(idProgramme: string): Promise<Array<Semaine>> {
    return firebase
      .firestore()
      .collection("Semaine")
      .where("id_programme", "==", idProgramme)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((d) => {
          return { ...d.data(), ...{ id: d.id } } as Semaine;
        });
      });
  }
}

export default new SemaineFirestoreService();
