import React, { Component } from "react";
import { Text, View, TextInput } from "../components/Themed";
import { StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//Ce composant sert à différents endroit permettant à l'utlisateur de renseigner des informations

//props à renseigner pour utiliser le composant
interface InputProps {
  placeholder: string; //indication permettant à l'utilisateur de savoir quoi renseigner
  iconName: string; //icone pour le côté esthétique et informatif
  hideCharacters: boolean; //les caractère doivent-ils être cachés ?
  keyboardType: string; //pavé numérique ? email ?
  onChangeText: (text: string) => void; //Que faire quand le texte a été renseigné ?
}

export default class Input extends Component<InputProps, {}> {
  //le composant se présente sous la forme d'une elipse dans laquelle il y a un icone et est indiqué ce que l'utilisateur soit renseigner
  render() {
    return (
      <View style={styles.inputContainer}>
        <Text>
          <Ionicons size={30} name={this.props.iconName} />
        </Text>
        <TextInput
          style={styles.inputText}
          placeholder={this.props.placeholder}
          keyboardType={this.props.keyboardType}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          secureTextEntry={this.props.hideCharacters}
          onChangeText={this.props.onChangeText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "red",
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputText: {
    height: 45,
    marginLeft: 16,
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center",
  },
});
