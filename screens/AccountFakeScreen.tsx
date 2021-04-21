import * as React from "react";
import { StyleSheet, Image } from "react-native";

import { Text, View } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import firebase from "firebase";
import UtilisateurFirestoreService, {
  Utilisateur,
} from "../services/utilisateur.firestoreservice";

//Page en cours

//props à renseigner pour utiliser le composant
interface AccountProps {
  navigation: StackNavigationProp<BottomTabParamList, "Account">; //propriété de naviagtion
}

//propriétés définies par le composant lui même
interface AccountState {
  curentUser: Utilisateur | null; //donne l'utilisateur connecté
  photoURL: string; //donne la photo de l'utilisateur (pas implémenté pour le moment)
}

export default class AccountFakeScreen extends React.Component<
  AccountProps,
  AccountState
> {
  //initialisation du state
  state: AccountState = {
    curentUser: null,
    photoURL: "",
  };

  //l'écran se présente sous la forme de la photo de l'utilisateur en haut à gauche de l'écran, à droite de celle-ci, les informations relatives à l'utilisateur et juste en dessous le nombre de séances réalisées à l'heure actuelle
  render() {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.user}>
            {this.state.photoURL != "" ? (
              <Image source={{ uri: this.state.photoURL }} />
            ) : (
              <Text>
                <Ionicons size={100} name="person-circle-outline" />
              </Text>
            )}
            <View style={styles.info}>
              <Text style={styles.nom_prenom}>
                {this.state.curentUser?.nom} {this.state.curentUser?.prenom}
              </Text>
              <Text>Age : {this.state.curentUser?.age} ans</Text>
              <Text>Poids : {this.state.curentUser?.poids} kg</Text>
              <Text>Email : {this.state.curentUser?.mail}</Text>
            </View>
          </View>
          <View style={styles.app}>
            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.2)"
            />
            <Text>
              Nombre de séance réalisée :{" "}
              {this.state.curentUser?.id_seances.length}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  //lorsque l'écran s'est affiché il faut charger les informations
  componentDidMount() {
    //on cache le header qui permettait de faire un retour vers la page de connexion
    this.props.navigation.setOptions({ headerLeft: () => null });
    this.loadUser();
  }

  //on charge l'utilisateur connecté depuis la base de donnée
  loadUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        UtilisateurFirestoreService.getUtilisateurById(uid).then(
          (utilisateur) => {
            this.setState({ curentUser: utilisateur });
          }
        );
        if (user.photoURL != null) this.setState({ photoURL: user.photoURL });
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  };
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginHorizontal: 20,
  },
  user: {
    flexDirection: "row",
  },
  nom_prenom: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  nom_image: {
    flexDirection: "row",
  },
  info: {
    alignSelf: "center",
    marginLeft: 10,
  },
  app: {
    alignItems: "center",
  },
});
