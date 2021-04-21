import { Programme } from "./services/programme.firestoreservice";
import { Seance } from "./services/seance.firestoreservice";
import { Semaine } from "./services/semaine.firestoreservice";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Account: undefined;
  Calendar: undefined;
};

export type HomeScreenParamList = {
  HomeScreen: undefined;
  ProgramListScreen: undefined;
  ProgramScreen: Programme;
  SemaineScreen: Semaine;
  SeanceScreen: Seance;
};

export type LogginParamList = {
  Loggin: undefined;
  SignUp: undefined;
  HomeScreen: undefined;
};
