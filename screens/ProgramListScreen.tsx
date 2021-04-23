import * as React from "react";
import { StyleSheet, FlatList, Alert } from "react-native";

import { Text, View } from "../components/Themed";

import ProgramItem from "../components/ProgramItem";
import ProgrammeFireStoreService, {
  Programme,
} from "../services/programme.firestoreservice";

import { HomeScreenParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";

import UtilisateurFirestoreService, {
  Utilisateur,
} from "../services/utilisateur.firestoreservice";
import firebase from "firebase";

//Page de la liste des programmes

//propriétés a renseigner au composant pour l'uiliser
interface ProgramListProps {
  navigation: StackNavigationProp<HomeScreenParamList, "ProgramListScreen">; //propriété de navigation
}

//propriété données par le composant lui-même
interface ProgramListState {
  programmes: Array<Programme>; //liste de tous les programmes
  curentUser: Utilisateur | null; //l'utilisateur connecté
}

class ProgramListScreen extends React.Component<
  ProgramListProps,
  ProgramListState
> {
  //initailisation du state
  state: ProgramListState = {
    programmes: [],
    curentUser: null,
  };

  //l'écran se présente sous la forme de la liste des programmeItem
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={(item) => item.name}
          data={this.state.programmes}
          renderItem={({ item }: { item: Programme }) => (
            <ProgramItem
              programme={item}
              onPressProg={this.onPressProg}
              navigation={this.props.navigation}
              curentUser={this.state.curentUser}
              onSwitchChange={this.onSwitchChange}
            />
          )}
        />
      </View>
    );
  }

  //lorsque l'écran s'est affiché, il faut charger les données
  componentDidMount() {
    this.loadProgrammes();
    this.loadUser();
  }

  //lorsque le swictch d'une séance change, on met à jour les informations en base de donnée
  onSwitchChange = (idSeance: string) => {
    // if (this.state.curentUser != null) {
    //   if (
    //     (this.state.curentUser.id_seances.find(
    //       (seance) => seance == idSeance
    //     ) || null) == null
    //   ) {
    //     var seances_id: Array<string> = [
    //       idSeance,
    //       ...this.state.curentUser.id_seances,
    //     ];
    //     if (this.state.curentUser.id != null)
    //       UtilisateurFirestoreService.onToggleSeance(
    //         this.state.curentUser.id,
    //         seances_id
    //       );
    //   } else {
    //     var seances_id: Array<string> = this.state.curentUser.id_seances.filter(
    //       (seance) => seance != idSeance
    //     );
    //     if (this.state.curentUser.id != null)
    //       UtilisateurFirestoreService.onToggleSeance(
    //         this.state.curentUser.id,
    //         seances_id
    //       );
    //   }
    //   this.loadUser();
    // }
    Alert.alert(
      "Désolé",
      "vous ne pouvez modifier l'état d'une séance seulement depuis la page du programme correspondant"
    );
  };

  //on récupère depuis la base de donnée l'utilisateur connecté
  loadUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        UtilisateurFirestoreService.getUtilisateurById(user.uid).then(
          (utilisateur) => {
            this.setState({ curentUser: utilisateur });
          }
        );
      } else {
        // User is signed out
        // ...
      }
    });
  };

  //on récupère les programmes en base de données
  loadProgrammes = () => {
    // Load all todos
    ProgrammeFireStoreService.listenProgrammes((programmes) =>
      this.setState({ programmes })
    );
  };

  //lorsqu'on clique sur un programme, on arrive sur la page d'un programme
  onPressProg = (programme: Programme) => {
    this.props.navigation.navigate("ProgramScreen", programme);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default ProgramListScreen;
