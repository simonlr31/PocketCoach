import * as React from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";

import { Text, View } from "../components/Themed";

import { Ionicons } from "@expo/vector-icons";

import { Seance } from "../services/seance.firestoreservice";
import SemaineList from "../components/SemaineList";
import { Semaine } from "../services/semaine.firestoreservice";
import { HomeScreenParamList } from "../types";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import semaineFirestoreservice from "../services/semaine.firestoreservice";
import ProgrammeFirestoreService, {
  Programme,
} from "../services/programme.firestoreservice";
import UtilisateurFirestoreService, {
  Utilisateur,
} from "../services/utilisateur.firestoreservice";
import firebase from "firebase";

//page d'un programme

//props a renseigner au composant pour l'utiliser
interface ProgramScreenProps {
  route: RouteProp<HomeScreenParamList, "ProgramScreen">; //propriété de navigation permettant de récupérer les information de la âge précédente
  navigation: StackNavigationProp<HomeScreenParamList, "ProgramScreen">; //propriété de navigation
}

//propriété renseignée par le composant lui-même
interface ProgramScreenState {
  semaines: Array<Semaine>; //liste des semaines du programme
  programmesUtilisateur: Array<Programme>; //liste des programmes de l'utilisateur connecté
  curentUser: Utilisateur | null; //l'utilisateur connecté
  userid: string; //l'id de l'uilisateur connecté
}

class ProgramScreen extends React.Component<
  ProgramScreenProps,
  ProgramScreenState
> {
  //initialisation du state
  state: ProgramScreenState = {
    semaines: [],
    programmesUtilisateur: [],
    curentUser: null,
    userid: "",
  };

  //si l'utilisateur ne possède pas le programme : image du programme + description du programme avec en dessosu un message indiquant que l'utilisateur ne possède pas encore le programme et en dessous le bouton pour acheter ce programme
  //si l'utilisateur possède le programme :l'écran se présente avec l'image du programme tout en gaut, la description en dessous et la liste des semaines
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.image_desciption_container}>
          <Image
            style={styles.strech}
            source={{
              uri: this.props.route.params.imageURL,
            }}
          />
          <Text style={styles.description}>
            {this.props.route.params.description}
          </Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.2)"
          />
        </View>
        {(this.state.programmesUtilisateur.find(
          (prog) => prog.id == this.props.route.params.id
        ) || null) == null ? (
          <View>
            <Text style={styles.warn}>
              <Ionicons size={20} name="warning-outline" />
              Vous ne possedez pas encore ce programme
              <Ionicons size={20} name="warning-outline" />
            </Text>
            <TouchableOpacity
              onPress={this.buyProg}
              style={[styles.buttonContainer, styles.buyButton]}
            >
              <Text style={styles.buy}>Acheter</Text>
              <Text>
                <Ionicons size={30} name="cart-outline" />
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <SemaineList
            semaines={this.state.semaines}
            onPressSeance={this.onPress}
            curentUser={this.state.curentUser}
            onSwitchChange={this.onSwitchChange}
          />
        )}
      </View>
    );
  }

  //lorsque le switch de la seance change on met à jour l'information en base de donnée (on l'ajoute ou la retire du tableau des seances complétée par l'utilisateur)
  onSwitchChange = (idSeance: string) => {
    if (this.state.curentUser != null) {
      if (
        (this.state.curentUser.id_seances.find(
          (seance) => seance == idSeance
        ) || null) == null
      ) {
        var seances_id: Array<string> = [
          idSeance,
          ...this.state.curentUser.id_seances,
        ];
        if (this.state.curentUser.id != null)
          UtilisateurFirestoreService.onToggleSeance(
            this.state.curentUser.id,
            seances_id
          );
      } else {
        var seances_id: Array<string> = this.state.curentUser.id_seances.filter(
          (seance) => seance != idSeance
        );
        if (this.state.curentUser.id != null)
          UtilisateurFirestoreService.onToggleSeance(
            this.state.curentUser.id,
            seances_id
          );
      }
      this.loadUserId();
    }
  };

  //lorsqu'on clique sur une seance on arrive sur la page correspondante à la séance
  onPress = (seance: Seance) => {
    this.props.navigation.navigate("SeanceScreen", seance);
  };

  //lorsque l'écran est affiché, il faut charger les informations
  componentDidMount() {
    this.loadSemaines();
    this.loadUserId();
  }

  //on récupère en abse de données les seamines relatives au programme
  loadSemaines = () => {
    semaineFirestoreservice
      .getSemainesFromProgramme(this.props.route.params.id)
      .then((semaines) => this.setState({ semaines: semaines.reverse() }));
  };

  //on récupère en base de donnée l'id de l'utilisateur connecté
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

  //on récupère en base de donnée les informations de l'utilisateur connecté
  loadUser = () => {
    UtilisateurFirestoreService.getUtilisateurById(this.state.userid).then(
      (utilisateur) => {
        this.setState({ curentUser: utilisateur });
        this.loadUserProgrammes();
      }
    );
  };

  //on récupère en base de données les programmes de l'utilisateur connecté
  loadUserProgrammes = () => {
    if (this.state.curentUser != null) {
      const programmesUtilisateurs: Array<Programme> = [];
      this.state.curentUser.id_programmes.map((id_programme) =>
        ProgrammeFirestoreService.getProgrammeById(id_programme).then(
          (programme) => {
            programmesUtilisateurs.push(programme);
            this.setState({ programmesUtilisateur: programmesUtilisateurs });
          }
        )
      );
    }
  };

  //au clic sur "acheter", on ajoute le programme aux programmes de l'utilisateur (le tunel de paiment n'a pas encoré été implémenté)
  buyProg = () => {
    var programmes_id: Array<string> = [
      this.props.route.params.id,
      ...this.state.programmesUtilisateur.map((prog) => prog.id),
    ];
    UtilisateurFirestoreService.updateProgrammesUtilisateur(
      this.state.userid,
      programmes_id
    );
    Alert.alert(
      "Merci",
      "C'est parti ! Tu peux commencer la première séance dès maintenant"
    );
    this.loadUserId();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image_desciption_container: {
    justifyContent: "center",
    alignItems: "center",
  },
  strech: {
    height: 200,
    width: Dimensions.get("window").width,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  description: {
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonContainer: {
    height: 45,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 20,
    width: 150,
    borderRadius: 30,
    alignSelf: "center",
    flexDirection: "row",
  },
  buyButton: {
    backgroundColor: "red",
  },
  buy: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  warn: {
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ProgramScreen;
