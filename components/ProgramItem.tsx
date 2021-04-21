import React from "react";
import { Text, View } from "../components/Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Programme } from "../services/programme.firestoreservice";
import semaineFirestoreservice, {
  Semaine,
} from "../services/semaine.firestoreservice";
import { Seance } from "../services/seance.firestoreservice";
import SemaineList from "./SemaineList";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreenParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Utilisateur } from "../services/utilisateur.firestoreservice";

//Item de programme a afficher dans la liste des programmes sur la pages présentant tous les programmes disponibles sur l'applicatio

//props à renseigner pour utiliser le composant
interface ProgramItemProps {
  programme: Programme; //quel programme le composant doit-il afficher ?
  onPressProg: (programme: Programme) => void; //que faire lorsque l'utilisateur clique sur un programme ?
  navigation: StackNavigationProp<HomeScreenParamList, "ProgramListScreen">; //propriété de navigation
  curentUser: Utilisateur | null; //quel utilisateur est connecté ?
  onSwitchChange: (idSeance: string) => void; //que faire lorsque le switch d'une changé est coché ou décoché ?
}

interface ProgramItemState {
  semaines: Array<Semaine>;
  showSemaines: boolean;
}
class ProgramItem extends React.Component<ProgramItemProps, ProgramItemState> {
  state: ProgramItemState = {
    semaines: [],
    showSemaines: false,
  };

  //permet de passer le programme en argument dans la fonction onPressProg
  onPressProg = () => {
    const prog = this.props.programme;
    this.props.onPressProg(prog);
  };

  //le composant se présente sous la forme d'un rectangle présentant le nom du programme avec au bout une flèche cliquable permettant d'afficher ou de cacher les semaines du programme
  render() {
    const showSemaines = this.state.showSemaines; //l'utilisateur a-t-il demandé à afficher les semaines ?
    return (
      <View>
        <TouchableOpacity onPress={this.onPressProg}>
          <View style={styles.container}>
            <Text style={styles.text}>{this.props.programme.name}</Text>
            <TouchableOpacity style={styles.button} onPress={this.onPress}>
              <Text>
                {showSemaines && <Ionicons size={30} name="chevron-up" />}
                {!showSemaines && <Ionicons size={30} name="chevron-down" />}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {showSemaines && (
          <View style={styles.semaineList}>
            <SemaineList
              semaines={this.state.semaines}
              onPressSeance={this.onPress}
              curentUser={this.props.curentUser}
              onSwitchChange={this.props.onSwitchChange}
            />
          </View>
        )}
      </View>
    );
  }

  //lorsque le composant s'est afficher il faut charger les informations
  componentDidMount() {
    this.loadSemaines();
  }

  //récupération en base de données des semaines correspondantes au programme
  loadSemaines = () => {
    semaineFirestoreservice
      .getSemainesFromProgramme(this.props.programme.id)
      .then((semaines) => this.setState({ semaines: semaines.reverse() }));
  };

  //navigation vers la page d'une seance lors du clic sur une seance (seance affichée dans la liste des semaines)
  onPressSeance = (seance: Seance) => {
    this.props.navigation.navigate("SeanceScreen", seance);
  };

  //lorsque l'utilisateur clique sur la flèche, showSemaines se met à jour
  onPress = () => {
    this.setState({ showSemaines: !this.state.showSemaines });
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    margin: 10,
  },
  text: {
    margin: 10,
    fontWeight: "bold",
  },
  stretch: {
    resizeMode: "stretch",
    height: 30,
    width: 30,
  },
  flatlist: {
    marginLeft: 10,
  },
  semaineList: {
    marginLeft: 20,
    borderLeftColor: "red",
    borderLeftWidth: 1,
  },
});

export default ProgramItem;
