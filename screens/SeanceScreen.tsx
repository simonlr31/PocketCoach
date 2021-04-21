import * as React from "react";
import { StyleSheet, FlatList, Dimensions } from "react-native";

import { Text, View } from "../components/Themed";

import VideoItem from "../components/VideoItem";
import VideoFirestoreService, {
  VideoSeance,
} from "../services/video.firestoreservice";
import { HomeScreenParamList } from "../types";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//page d'un seance

//props a renseigner pour utiliser le composant
interface SeancecreenProps {
  route: RouteProp<HomeScreenParamList, "SeanceScreen">; //propriété de navigation permettant de connaitre les information renseignées sur la page précédente
  navigation: StackNavigationProp<HomeScreenParamList, "SeanceScreen">; //propriété de navigation
}

//propriété renseignées par l'écran lui même
interface SeanceScreenState {
  videos: Array<VideoSeance>; //tableau des videos de la seance
}

class ProgramScreen extends React.Component<
  SeancecreenProps,
  SeanceScreenState
> {
  //initailisation du state
  state: SeanceScreenState = {
    videos: [],
  };

  //l'éccran se présente sous la forme d'une description de la séance avec en dessous la liste des vidéos à suivre pour la séance
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.image_desciption_container}>
          <Text style={styles.description}>
            {this.props.route.params.description}
          </Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.2)"
          />
        </View>
        <FlatList
          keyExtractor={(item) => item.nom}
          data={this.state.videos}
          renderItem={({ item }: { item: VideoSeance }) => (
            <VideoItem video={item} />
          )}
        />
      </View>
    );
  }

  //lorsque l'écran est affiché, on charge les données
  componentDidMount() {
    this.loadVideos();
  }

  //on récupère en base de données la liste des vidéos de la séance
  loadVideos = () => {
    VideoFirestoreService.getVideosFromSeance(
      this.props.route.params.id
    ).then((videos) => this.setState({ videos }));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image_desciption_container: {
    justifyContent: "center",
    alignItems: "center",
  },
  strech: {
    height: 200,
    width: Dimensions.get("window").width,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  description: {
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default ProgramScreen;
