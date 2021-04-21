import React from "react";
import { Text, View } from "../components/Themed";
import { StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Semaine } from "../services/semaine.firestoreservice";
import SeanceFirestoreService, {
  Seance,
} from "../services/seance.firestoreservice";
import SeanceItem from "./SeanceItemProgramScreen";
import { Ionicons } from "@expo/vector-icons";
import UtilisateurFirestoreService, {
  Utilisateur,
} from "../services/utilisateur.firestoreservice";

//Composant présentant une semaine de programme

//props à renseigner pour utiliser le composant
interface SemaineItemProps {
  semaine: Semaine; //quelle semaine ?
  onPressSeance: (seance: Seance) => void; //que faire quand on clique sur une séance ?
  curentUser: Utilisateur | null; //qui est connecté ?
  onSwitchChange: (idSeance: string) => void; //que faire quand le switch de la seance change ?
}

//propriétés définies par le composant lui même
interface SemaineItemState {
  seances: Array<Seance>; //donne les seances de la semaine
  showSeances: boolean; //affiche les seances ou non ?
}
class SemaineItem extends React.Component<SemaineItemProps, SemaineItemState> {
  //Initialisatin du state
  state: SemaineItemState = {
    seances: [],
    showSeances: false,
  };

  //Le composant se présente sous la forme d'un rectangle avec un flèche permattant d'afficher les seances
  render() {
    const showSeances = this.state.showSeances; //on affiche les seances ?
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <View style={styles.container}>
            <Text style={styles.text}>{this.props.semaine.nom}</Text>
            <TouchableOpacity style={styles.button} onPress={this.onPress}>
              <Text>
                {showSeances && <Ionicons size={30} name="chevron-up" />}
                {!showSeances && <Ionicons size={30} name="chevron-down" />}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {showSeances && (
          <FlatList
            style={styles.flatlist}
            keyExtractor={(item) => item.nom}
            data={this.state.seances}
            renderItem={({ item }: { item: Seance }) => (
              <SeanceItem
                seance={item}
                onSwitchChange={this.props.onSwitchChange}
                onPress={this.props.onPressSeance}
              />
            )}
          />
        )}
      </View>
    );
  }

  //lorsqu'on clique sur la flèche, on met a jour showSeances
  onPress = () => {
    this.setState({ showSeances: !this.state.showSeances });
  };

  //lorsque le compsant s'est affiché, il faut charger les données
  componentDidMount() {
    this.loadSeances();
  }

  //on réupère en bdd les séances correspondantes à la semaine
  loadSeances = () => {
    SeanceFirestoreService.getSeancesFromSemaine(
      this.props.semaine.id
    ).then((seances) => this.setState({ seances }));
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
});

export default SemaineItem;
