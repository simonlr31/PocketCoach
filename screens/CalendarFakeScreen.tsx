import * as React from "react";
import {
  StyleSheet,
  ViewPagerAndroidOnPageScrollEventData,
} from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

import { BottomTabParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import HistoryList from "../components/HistoryList";
import UtilisateurFirestoreService, {
  Utilisateur,
} from "../services/utilisateur.firestoreservice";
import SeanceFirestoreService, {
  Seance,
} from "../services/seance.firestoreservice";
import firebase from "firebase";

//Page en cours

interface CalendarProps {
  navigation: StackNavigationProp<BottomTabParamList, "Calendar">;
}

interface CalendarState {
  curentUser: Utilisateur | null;
  seances: Array<Seance>;
}

export default class CalendarFakeScreen extends React.Component<
  CalendarProps,
  CalendarState
> {
  state: CalendarState = {
    curentUser: null,
    seances: [],
  };
  render() {
    return (
      <View>
        <Text style={styles.title}>Future page calendrier</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        {/* <HistoryList seances={this.state.seances} /> */}
      </View>
    );
  }
  componentDidMount() {
    this.props.navigation.setOptions({ headerLeft: () => null });
    this.loadUser;
  }

  loadUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        UtilisateurFirestoreService.getUtilisateurById(uid)
          .then((utilisateur) => {
            this.setState({ curentUser: utilisateur });
          })
          .then(this.loadSeances);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  };

  loadSeances = () => {
    this.state.curentUser?.id_seances.map((idSeance) =>
      SeanceFirestoreService.getSeancesById(idSeance).then((seance) => {
        this.state.seances.push(seance);
      })
    );
  };
}

const styles = StyleSheet.create({
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
