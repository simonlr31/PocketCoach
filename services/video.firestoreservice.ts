import firebase from "firebase/app";
import "firebase/firestore";

//service pour interragir avec la collection Video de firabse

//défintion d'une video
export interface VideoSeance {
  id: string;
  nom: string;
  description: string;
  url: string;
  id_seance: string;
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

class VideoFirestoreService {
  constructor() {
    //firebase.initializeApp(firebaseconfig);
  }

  //ajouter une video en bdd
  addVideo(video: VideoSeance): Promise<firebase.firestore.DocumentReference> {
    return firebase.firestore().collection("Video").add(video);
  }

  //supprimer un video de la bdd
  removeVideo(id: string): Promise<void> {
    return firebase.firestore().collection("Video").doc(id).delete();
  }

  //recuperer toutes les videos en bdd
  getVideos(): Promise<Array<VideoSeance>> {
    return firebase
      .firestore()
      .collection("Video")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((d) => {
          return { ...d.data(), ...{ id: d.id } } as VideoSeance;
        });
      });
  }

  //recupérer toutes les videos en bdd
  listenVideos(
    onVideosChange: (videos: Array<VideoSeance>) => void
  ): () => void {
    return firebase
      .firestore()
      .collection("Video")
      .onSnapshot((querySnapshot) => {
        onVideosChange(
          querySnapshot.docs.map(
            (d) => ({ ...d.data(), ...{ id: d.id } } as VideoSeance)
          )
        );
      });
  }

  //recupérer toutes les videos correspondantes a une seance
  getVideosFromSeance(idSeance: string): Promise<Array<VideoSeance>> {
    return firebase
      .firestore()
      .collection("Video")
      .where("id_seance", "==", idSeance)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((d) => {
          return { ...d.data(), ...{ id: d.id } } as VideoSeance;
        });
      });
  }
}

export default new VideoFirestoreService();
