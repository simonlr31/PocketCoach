import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ProgramListScreen from "../screens/ProgramListScreen";
import ProgramScreen from "../screens/ProgramScreen";
import SeanceScreen from "../screens/SeanceScreen";
import AccountFakeScreen from "../screens/AccountFakeScreen";
import CalendarFakeScreen from "../screens/CalendarFakeScreen";
import HomeScreen from "../screens/HomeScreen";
import { BottomTabParamList, HomeScreenParamList } from "../types";

//Tabbar de l'application

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

//Les pages de la tabbar : Home, calendrier et compte
export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
        showLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={CalendarFakeNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Account"
        component={AccountFakeNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

//Les page accessibles depuis l'accueil : accueil, liste des programmes, page d'un programme, page d'une séance
const HomeStack = createStackNavigator<HomeScreenParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: "Accueil" }}
      />
      <HomeStack.Screen
        name="ProgramListScreen"
        component={ProgramListScreen}
        options={{ headerTitle: "Programmes" }}
      />
      <HomeStack.Screen
        name="ProgramScreen"
        component={ProgramScreen}
        options={({ route }) => ({ headerTitle: route.params.name })}
      />
      <HomeStack.Screen
        name="SeanceScreen"
        component={SeanceScreen}
        options={({ route }) => ({ headerTitle: route.params.nom })}
      />
    </HomeStack.Navigator>
  );
}

//Les pages accessibles depuis le compte : le compte
const AccountFakeStack = createStackNavigator<BottomTabParamList>();

function AccountFakeNavigator() {
  return (
    <AccountFakeStack.Navigator>
      <AccountFakeStack.Screen
        name="Account"
        component={AccountFakeScreen}
        options={{ headerTitle: "Fake Account" }}
      />
    </AccountFakeStack.Navigator>
  );
}

//les pages accessibles depuis le calendrier : le calendrier
const CalendarFakeStack = createStackNavigator<BottomTabParamList>();

function CalendarFakeNavigator() {
  return (
    <CalendarFakeStack.Navigator>
      <CalendarFakeStack.Screen
        name="Calendar"
        component={CalendarFakeScreen}
        options={{ headerTitle: "Fake Calendar" }}
      />
    </CalendarFakeStack.Navigator>
  );
}
