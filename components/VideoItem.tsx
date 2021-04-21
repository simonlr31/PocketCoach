import React from "react";
import { Text, View } from "./Themed";
import { StyleSheet } from "react-native";
import { VideoSeance } from "../services/video.firestoreservice";
import { Video } from "expo-av";

//props à renseigner pour utiliser le composant
interface VideoItemProps {
  video: VideoSeance;
}

class SeanceItem extends React.Component<VideoItemProps, {}> {
  //Le composant présente le player vidéo prenant toute la largeur de l'écran et en dessous le titre et la descritpion
  render() {
    return (
      <View>
        <Video
          isMuted={false}
          style={styles.video}
          source={{ uri: this.props.video.url }}
          useNativeControls
          resizeMode="cover"
          isLooping
        />
        <View>
          <Text style={styles.titre}>{this.props.video.nom}</Text>
          <Text style={styles.description}>{this.props.video.description}</Text>
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.2)"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  switch: {
    margin: 10,
  },
  titre: {
    marginHorizontal: 10,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 25,
  },
  description: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  video: {
    alignSelf: "center",
    width: "100%",
    aspectRatio: 16 / 9,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    alignSelf: "center",
  },
});

export default SeanceItem;
