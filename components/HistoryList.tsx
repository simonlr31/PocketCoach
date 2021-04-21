import React from "react";
import { Text, View } from "../components/Themed";
import { StyleSheet, FlatList } from "react-native";
import { Seance } from "../services/seance.firestoreservice";
import HistoryItem from "./HistoryItem";

//Composant non utilisé pour l'instant, il permettra d'afficher la liste des séances déjà faite

interface HistoryListProps {
  seances: Array<Seance>;
}

class HistoryList extends React.Component<HistoryListProps, {}> {
  render() {
    return (
      <View>
        <FlatList
          style={styles.flatlist}
          keyExtractor={(item) => item.nom}
          data={this.props.seances}
          renderItem={({ item }: { item: Seance }) => (
            <HistoryItem seance={item} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "flex-start",
    // justifyContent: "flex-start",
  },
  button: {
    margin: 10,
  },
  text: {
    //color: "black",
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

export default HistoryList;
