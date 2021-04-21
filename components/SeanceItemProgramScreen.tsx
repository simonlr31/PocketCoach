import React from "react";
import { Text, View } from "./Themed";
import { StyleSheet, Switch } from "react-native";
import { Seance } from "../services/seance.firestoreservice";
import { TouchableOpacity } from "react-native-gesture-handler";
import UtilisateurFirestoreService, {
  Utilisateur,
} from "../services/utilisateur.firestoreservice";
import firebase from "firebase";

//Le composant correspond à l'affichage d'un item seance sur la page d'un programme

//props à renseigner pour utiliser le composant
interface SeanceItemProps {
  seance: Seance; //quelle seance l'item doit-il afficher ?
  onSwitchChange: (idSeance: string) => void; //que se passe-t-il lorsque l'utilisateur change le switch de position
  onPress: (seance: Seance) => void; //Que faire lorsque l'utilisateur clique sur le composant ?
}

//propriétés définies par le composant lui même
interface SeanceItemState {
  seances_utilisateur: Array<string>; //donne les seances qu'un utilisateur a déjà réalisées
  curentUser: Utilisateur | null; //donne l'utilisateur actuellement connecté
  userid: string; //donne l'id de l'utilisateur actuellement connecté
}

class SeanceItem extends React.Component<SeanceItemProps, SeanceItemState> {
  //initialisation du state
  state: SeanceItemState = {
    seances_utilisateur: [],
    curentUser: null,
    userid: "",
  };

  //Le composant se présente sous la forme d'un rectangle avec le nom de la séance à gauche et à doite un switch permettant de cocher comme faite ou non la dite séance
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPressSeance}>
          <View style={styles.container}>
            <Text style={styles.text}>{this.props.seance.nom}</Text>
            <Switch
              value={
                //La seance a-t-elle déjà renseignée comme faite ou non ?
                (this.state.seances_utilisateur.find(
                  (seance) => seance == this.props.seance.id
                ) || null) == null
                  ? false
                  : true
              }
              style={styles.switch}
              onValueChange={this.onSwitchChange}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  //que  lorsque le switch change ?
  onSwitchChange = () => {
    const idSeance = this.props.seance.id;
    this.props.onSwitchChange(idSeance);

    //on recharge les proriétés du composant pour l'actualiser
    this.loadUserId();
  };

  //On donne la seance à la fonction onPress dans les props
  onPressSeance = () => {
    const s = this.props.seance;
    this.props.onPress(s);
  };

  //Lorsque le composant est affiché, il faut charger les données
  componentDidMount() {
    this.loadUserId();
  }

  //On récupère en base de données l'id utilsateur
  loadUserId = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        this.setState({ userid: uid });
        // ...
      } else {
        // User is signed out
        // ...
      }
      //une fois qu'on a l'id, on récupère ses informations
      this.loadUser();
    });
  };

  //on récupère en base de donnée l'utilisateur connecté
  loadUser = () => {
    UtilisateurFirestoreService.getUtilisateurById(this.state.userid).then(
      (utilisateur) => {
        this.setState({ curentUser: utilisateur });
        //on transmet les seances déjà réalisées par l'utilisateur
        this.setState({ seances_utilisateur: utilisateur.id_seances });
      }
    );
  };
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

export default SeanceItem;
