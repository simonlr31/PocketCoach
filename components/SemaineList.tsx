import * as React from "react";
import { StyleSheet, FlatList } from "react-native";

import { Text, View } from "../components/Themed";

import SemaineItem from "../components/SemaineItem";
import { Semaine } from "../services/semaine.firestoreservice";
import { Seance } from "../services/seance.firestoreservice";
import { Utilisateur } from "../services/utilisateur.firestoreservice";

//Liste des semaines d'un programme

//props à renseigner pour utiliser le composant
interface SemaineListProps {
  semaines: Array<Semaine>; //la liste des semaines à afficher ?
  onPressSeance: (seance: Seance) => void; //que faire lorsqu'on clique sur une seance ?
  curentUser: Utilisateur | null; //qui est connecté ?
  onSwitchChange: (idSeance: string) => void; //que faire lorsque le switch d'une seance change ?
}

class ProgramListScreen extends React.Component<SemaineListProps, {}> {
  //le composant se présente sous la forme d'une liste de SemaineItem
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={(item) => item.nom}
          data={this.props.semaines}
          renderItem={({ item }: { item: Semaine }) => (
            <SemaineItem
              semaine={item}
              onPressSeance={this.props.onPressSeance}
              curentUser={this.props.curentUser}
              onSwitchChange={this.props.onSwitchChange}
            />
          )}
        />
      </View>
    );
  }
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
