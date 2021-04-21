import React from "react";
import { Text, View } from "../components/Themed";
import { StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Programme } from "../services/programme.firestoreservice";
import { Dimensions } from "react-native";

//props à renseigner pour utiliser le composant
interface ProgramItemProps {
  programme: Programme; //quel programme afficher ?
  onPressProg: (programme: Programme) => void; //que faire lorsque l'utilisateur clique dessus ?
}

class ProgramItem extends React.Component<ProgramItemProps, {}> {
  //Fonction permettant de passer en argument le programme correspondant
  onPressProg = () => {
    const prog = this.props.programme;
    this.props.onPressProg(prog);
  };

  //L'item est un "bouton" présentant l'image du programme et le nom de programme écrit par dessus
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPressProg}>
          <View style={styles.container}>
            <ImageBackground
              style={styles.stretch}
              source={{ uri: this.props.programme.imageURL }}
            >
              <Text style={styles.text} adjustsFontSizeToFit>
                {this.props.programme.name}
              </Text>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    margin: 10,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 50,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  stretch: {
    margin: 10,
    resizeMode: "stretch",
    height: 500,
    width: Dimensions.get("window").width - 20,
    borderRadius: 30,
    overflow: "hidden",
  },
});

export default ProgramItem;
