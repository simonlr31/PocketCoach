import React from "react";
import { Text, View } from "./Themed";
import { StyleSheet } from "react-native";
import { Seance } from "../services/seance.firestoreservice";

//Pas utilisé pour l'instant, ce composant permettra d'afficher l'historique des séances

interface HistoryItemProps {
  seance: Seance;
}

class HistoryItem extends React.Component<HistoryItemProps, {}> {
  render() {
    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.text}>{this.props.seance.nom}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  switch: {
    margin: 10,
  },
  text: {
    margin: 10,
  },
});

export default HistoryItem;
