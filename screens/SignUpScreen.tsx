import React, { Component } from "react";

import { Text, View } from "../components/Themed";

import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import Input from "../components/Input";
import UtilisateurFireStoreService, {
  Utilisateur,
} from "../services/utilisateur.firestoreservice";
import { LogginParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import firebase from "firebase";

//Page d'inscirpition

//props a renseigner au composant pour l'ulisser
interface AuthFormProps {
  navigation: StackNavigationProp<LogginParamList, "SignUp">; //propriété de naviagion
}

//proriété renseignées par le composant lui même
interface AuthFormState {
  nom: string; //nom entré
  prenom: string; //prenom entré
  age: number; //age
  poids: number; //poids
  mail: string; //email
  password: string; //mot de passe
  passwordConfirmation: string; //confirmation du mot de passe
}

export default class AuthForm extends Component<AuthFormProps, AuthFormState> {
  //initilisation du state
  state: AuthFormState = {
    nom: "",
    prenom: "",
    age: 0,
    poids: 0,
    mail: "",
    password: "",
    passwordConfirmation: "",
  };

  //mise a jour des states en fontions des information renseignées par l'utilisateur
  onChangePrenom = (prenom: string) => {
    this.setState({ prenom });
  };

  onChangeNom = (nom: string) => {
    this.setState({ nom });
  };
  onChangeAge = (age: string) => {
    const ageNumber: number = +age;
    this.setState({ age: ageNumber });
  };

  onChangePoids = (poids: string) => {
    const poidsNumber: number = +poids;
    this.setState({ poids: poidsNumber });
  };
  onChangeLogin = (mail: string) => {
    this.setState({ mail });
  };

  onChangePassword = (password: string) => {
    this.setState({ password });
  };

  onChangePasswordConfirmation = (passwordConfirmation: string) => {
    this.setState({ passwordConfirmation });
  };

  //Pour l'inscicription, on fait appel à la fonction de firebase grace a l'email et mot de passe entré + on enregistre en base de données les infromation supplémentaires relative à l'utilisateur
  signUp = () => {
    if (
      this.state.nom != "" &&
      this.state.prenom != "" &&
      this.state.age != 0 &&
      this.state.poids != 0 &&
      this.state.passwordConfirmation == this.state.password
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.mail, this.state.password)
        .then((userCredential) => {
          // Signed in
          const user: Utilisateur = {
            id: userCredential.user?.uid,
            nom: this.state.nom,
            prenom: this.state.prenom,
            age: this.state.age,
            poids: this.state.poids,
            mail: this.state.mail,
            id_programmes: [],
            id_seances: [],
          };
          UtilisateurFireStoreService.addUtilisateurWithId(user);
          Alert.alert("Bienvenue", "Votre compte a bien été créé");
          this.props.navigation.navigate("Loggin");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          Alert.alert(errorCode, errorMessage);
          // ..
        });
    } else if (
      this.state.nom == "" ||
      this.state.prenom == "" ||
      this.state.age == 0 ||
      this.state.poids == 0
    ) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
    } else {
      Alert.alert("Erreur", "Les mots de passe doivent être identiques");
    }
  };

  //La page se présente comme une succession d'input correspondante aux information a renseigner par l'utilisateur et en bas le bouton d'incription. Tout en haut l'image de l'application
  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <Image
            style={styles.formImage}
            source={require("../assets/images/CLC.png")}
          />

          <Input
            placeholder="Nom"
            iconName="text-outline"
            keyboardType="default"
            hideCharacters={false}
            onChangeText={this.onChangeNom}
          />
          <Input
            placeholder="Prenom"
            iconName="text-outline"
            keyboardType="default"
            hideCharacters={false}
            onChangeText={this.onChangePrenom}
          />
          <Input
            placeholder="Age"
            iconName="text-outline"
            keyboardType="number-pad"
            hideCharacters={false}
            onChangeText={this.onChangeAge}
          />
          <Input
            placeholder="Poids"
            iconName="text-outline"
            keyboardType="number-pad"
            hideCharacters={false}
            onChangeText={this.onChangePoids}
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
          <Input
            placeholder="Confirmez le mot de passe"
            iconName="lock-closed-outline"
            keyboardType="default"
            hideCharacters={true}
            onChangeText={this.onChangePasswordConfirmation}
          />
          <TouchableOpacity
            style={[styles.buttonContainer, styles.signInButton]}
            onPress={this.signUp}
          >
            <Text style={styles.loginText}>S'inscrire</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
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
