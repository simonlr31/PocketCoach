import firebase from "firebase/app";
import "firebase/firestore";

//service pour interragir avec la collection Utilisateur de firabse

//définition d'un utilisateur
export interface Utilisateur {
  id?: string;
  nom: string;
  prenom: string;
  age: number;
  poids: number;
  mail: string;
  id_programmes: Array<string>;
  id_seances: Array<string>;
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

class UtilisateurFirestoreService {
  constructor() {
    firebase.initializeApp(firebaseconfig);
  }

  //Ajout d'un utulisateur en bdd
  addUtilisateur(
    utilisateur: Utilisateur
  ): Promise<firebase.firestore.DocumentReference> {
    return firebase.firestore().collection("Utilisateur").add(utilisateur);
  }

  //ajout d'un utilisateur avec un id prédéfini -> utilise pour la création de compte avec la méthode firebase
  addUtilisateurWithId(utilisateur: Utilisateur): Promise<void> {
    return firebase
      .firestore()
      .collection("Utilisateur")
      .doc(utilisateur.id)
      .set(utilisateur);
  }

  //supprimer un utilisateur en bdd
  removeUtilisateur(id: string): Promise<void> {
    return firebase.firestore().collection("Utilisateur").doc(id).delete();
  }

  //récupérer tous les utilisateur en bdd
  getUtilisateurs(): Promise<Array<Utilisateur>> {
    return firebase
      .firestore()
      .collection("Utilisateur")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((d) => {
          return { ...d.data(), ...{ id: d.id } } as Utilisateur;
        });
      });
  }

  //récupérer un utilisateur en particulier grace a son ID
  getUtilisateurById(idUtilisateur: string): Promise<Utilisateur> {
    return firebase
      .firestore()
      .collection("Utilisateur")
      .doc(idUtilisateur)
      .get()
      .then((querySnapshot) => {
        return {
          ...querySnapshot.data(),
          ...{ id: querySnapshot.id },
        } as Utilisateur;
      });
  }

  //mettre a jour les programmes que possède un utilisateur grace a l'id de l'utilisateur et un tableau contenant les id des programmes achetés
  updateProgrammesUtilisateur(
    idUtilisateur: string,
    id_programmes: Array<string>
  ): Promise<void> {
    return firebase
      .firestore()
      .collection("Utilisateur")
      .doc(idUtilisateur)
      .update({ id_programmes: id_programmes });
  }

  //mis a jour des seance complétée ou non grace a l'id de l'utilisateur et un tableau contenant les id des seances complétées par l'utilisateur
  onToggleSeance(
    idUtilisateur: string,
    id_seances: Array<string>
  ): Promise<void> {
    return firebase
      .firestore()
      .collection("Utilisateur")
      .doc(idUtilisateur)
      .update({ id_seances: id_seances });
  }

  //recupérer tous les utilisateur en bdd
  listenUtilisteurs(
    onUtilisateursChange: (utilisateurs: Array<Utilisateur>) => void
  ): () => void {
    return firebase
      .firestore()
      .collection("Utilisateur")
      .onSnapshot((querySnapshot) => {
        onUtilisateursChange(
          querySnapshot.docs.map(
            (d) => ({ ...d.data(), ...{ id: d.id } } as Utilisateur)
          )
        );
      });
  }
}

export default new UtilisateurFirestoreService();
