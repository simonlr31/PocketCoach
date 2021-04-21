import * as React from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";

import AccueilItem from "../components/AccueilItem";
import ProgrammeFireStoreService, {
  Programme,
} from "../services/programme.firestoreservice";

import { HomeScreenParamList, LogginParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import UtilisateurFirestoreService, {
  Utilisateur,
} from "../services/utilisateur.firestoreservice";
import firebase from "firebase";

//Page d'accueil

//props à renseigné au composant pour l'utiliser
interface ProgramListProps {
  navigation: StackNavigationProp<HomeScreenParamList, "HomeScreen">; //propriété de navigation
}

//propriétés renseignées par le composant lui même
interface ProgramListState {
  programmes: Array<Programme>; //les programmes affichés
  programmesUtilisateur: Array<Programme>; //les programmes de l'utilisateur connecté
  curentUser: Utilisateur | null; //l'utilisateur connecté
  userid: string; //l'id de l'utilisateur connecté
}

class ProgramListScreen extends React.Component<
  ProgramListProps,
  ProgramListState
> {
  //initialisation du state
  state: ProgramListState = {
    programmes: [],
    programmesUtilisateur: [],
    curentUser: null,
    userid: "",
  };

  //Liste de accueil item avec un bouton permettant d'accéder à la page de la liste de tous les programmes
  render() {
    return (
      <View>
        <FlatList
          keyExtractor={(item) => item.name}
          data={
            this.state.programmesUtilisateur.length > 0
              ? this.state.programmesUtilisateur
              : this.state.programmes
          }
          renderItem={({ item }: { item: Programme }) => (
            <AccueilItem programme={item} onPressProg={this.onPressProg} />
          )}
          ListFooterComponent={
            this.state.programmes.length > 1 ? (
              <TouchableOpacity
                style={styles.button}
                onPress={this.onPressVoirTout}
              >
                <Text style={styles.button_text}>Voir tous les programmes</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )
          }
        />
      </View>
    );
  }

  //lorsque l'écran a chargé, il faut charger les données
  componentDidMount() {
    this.loadUserId();
    this.loadProgrammes();

    //on désactive le header qui permet de faire un retour vers la page de login
    this.props.navigation.setOptions({
      headerLeft: () => null,
    });
  }

  //lorsqu'on clique sur le bouton "voir tous les programmes", on arrive naturellement vers la page de la liste de tous les programmes
  onPressVoirTout = () => {
    this.props.navigation.navigate("ProgramListScreen");
  };

  //on va chercher dans la base de donnée l'id de l'utilisateur connecté
  loadUserId = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        this.setState({ userid: uid });
        // ...
      } else {
        // User is signed out
        // ...
      }
      this.loadUser();
    });
  };

  //on va chercher en base de donnée les information sur l'utilisateur connecté grace à son ID
  loadUser = () => {
    UtilisateurFirestoreService.getUtilisateurById(this.state.userid).then(
      (utilisateur) => {
        this.setState({ curentUser: utilisateur });
        this.loadUserProgrammes();
      }
    );
  };

  //on récupère les programmes déjà achetés par l'utilisateur
  loadUserProgrammes = () => {
    if (this.state.curentUser != null) {
      const programmesUtilisateurs: Array<Programme> = [];
      this.state.curentUser.id_programmes.map((id_programme) =>
        ProgrammeFireStoreService.getProgrammeById(id_programme).then(
          (programme) => {
            programmesUtilisateurs.push(programme);
            this.setState({ programmesUtilisateur: programmesUtilisateurs });
          }
        )
      );
    }
  };

  //on récupère tous les programmes en base de donnée
  loadProgrammes = () => {
    ProgrammeFireStoreService.listenProgrammes((programmes) =>
      this.setState({ programmes })
    );
  };

  //au clic sur un programme on navigue vers la page correspondante au programme
  onPressProg = (programme: Programme) => {
    this.props.navigation.navigate("ProgramScreen", programme);
  };
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
    padding: 10,
    alignSelf: "center",
    borderRadius: 10,
    margin: 10,
  },
  button_text: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
});

export default ProgramListScreen;
