import React, { Component } from "react";

import { Text, View } from "../components/Themed";

import { StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import Input from "../components/Input";
import UtilisateurFireStoreService, {
  Utilisateur,
} from "../services/utilisateur.firestoreservice";
import { LogginParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import firebase from "firebase/app";

//Ecran de connexon

//props a renseigner au composant pour l'utiliser
interface AuthFormProps {
  navigation: StackNavigationProp<LogginParamList, "Loggin">; //propriété de navigation
}

//propriétés renseignées par le composant lui même
interface AuthFormState {
  login: string; //l'adresse email entrée par l'utilisateur
  password: string; //le mot de passe entré par l'utilisateur
  utilisateur: Utilisateur | null; //l'utilisateur qui se connecte
}

export default class AuthForm extends Component<AuthFormProps, AuthFormState> {
  //initialisation du state
  state: AuthFormState = {
    login: "",
    password: "",
    utilisateur: null,
  };

  //lorsque l'utilisateur change le texte dans l'input correpondant à l'adresse email, on transmet celle-ci au state
  onChangeLogin = (login: string) => {
    this.setState({ login });
  };

  //de meme pour le mot de passe
  onChangePassword = (password: string) => {
    this.setState({ password });
  };

  //lorsque l'utilisateur veut se connecter, on passe par la fonction "signInWithEmailAndPassword" de firebase
  signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.login, this.state.password)
      .then((userCredential) => {
        // Signed in
        this.props.navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        Alert.alert(errorCode, errorMessage);
      });
  };

  //lorsque l'utilisateur a oublié son mot de passe, on passe par firebase pour lui envoyer un email de réinitialisation
  resetPassword = () => {
    const login: string = this.state.login;
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.login)
      .then(function () {
        Alert.alert(
          "Renitialiser le mot de passe",
          `un email a été envoyé à ${login}`
        );
      })
      .catch(function (error) {
        // An error happened.
        var errorCode = error.code;
        var errorMessage = error.message;
        Alert.alert(errorCode, errorMessage);
      });
  };

  //lorsque l'utilisateur clique sur le bouton "s'inscire", il arrive sur la page d'inscription
  signUp = () => {
    this.props.navigation.navigate("SignUp");
  };

  //l'écran se présente avec le logo de l'application et en dessous 2 inputs : un permettant à l'utilisateur de saisir son adresse mail et l'autre son mot de passe. Ensuite, il y a 3 boutons : "se connecter", "mot de passe oublié ?", "s'inscire"
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.formImage}
          source={require("../assets/images/CLC.png")}
        />
        <Input
          placeholder="Email"
          iconName="at-outline"
          keyboardType="email-address"
          hideCharacters={false}
          onChangeText={this.onChangeLogin}
        />
        <Input
          placeholder="Mot de passe"
          iconName="lock-closed-outline"
          keyboardType="default"
          hideCharacters={true}
          onChangeText={this.onChangePassword}
        />
        <TouchableOpacity
          style={[styles.buttonContainer, styles.signInButton]}
          onPress={this.signIn}
        >
          <Text style={styles.loginText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.resetPassword}
        >
          <Text>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.signUp}>
          <Text>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formImage: {
    borderBottomWidth: 1,
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  signInButton: {
    backgroundColor: "red",
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
