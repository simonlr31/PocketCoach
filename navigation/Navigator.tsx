import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import useColorScheme from "../hooks/useColorScheme";
import LogginScreen from "../screens/LogginScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { LogginParamList } from "../types";
import SignUpScreen from "../screens/SignUpScreen";

//Passage de la page de connexion à l'application

const LogginStack = createStackNavigator<LogginParamList>();

//Pages accessibles depuis la page de login : login, s'incrire, l'application

export default function LogginNavigator() {
  const colorScheme = useColorScheme();
  return LogginStackNavigator();
}

function LogginStackNavigator() {
  return (
    <LogginStack.Navigator>
      <LogginStack.Screen
        name="Loggin"
        component={LogginScreen}
        options={{ header: () => null }}
      />
      <LogginStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ header: () => null }}
      />
      <LogginStack.Screen
        name="HomeScreen"
        component={BottomTabNavigator}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </LogginStack.Navigator>
  );
}
