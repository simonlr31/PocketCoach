import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Loggin: {
            LogginScreen: "loggin",
            SignUpScreen: "signup",
            HomeScreen: "home",
          },
          Home: {
            screens: {
              HomeScreen: "homescreen",
              ProgramListScreen: "programlist",
              ProgramScreen: "program",
              SeanceScreen: "seance",
            },
          },
          Program: {
            screens: {
              ProgramScreen: "program",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};
