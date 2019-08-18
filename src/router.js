import React from "react";
import {
  createSwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import SignIn from "./containers/SignIn";
import Dashboard from "./containers/Dashboard";
import Scan from "./containers/Scan";
import CheckIns from "./containers/CheckIns";
import * as StatusBar from "react-native";
import Platform from "react-native";

import { Ionicons } from "@expo/vector-icons";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const SignedOut = createStackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      headerStyle
    }
  }
});

export const SignedIn = createBottomTabNavigator(
  {
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons
            name="md-home"
            size={20}
            color={tintColor}
            style={{ marginTop: 6 }}
          />
        )
      }
    },
    Scan: {
      screen: Scan,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons
            name="md-qr-scanner"
            size={20}
            color={tintColor}
            style={{ marginTop: 6 }}
          />
        )
      }
    },
    CheckIns: {
      screen: CheckIns,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons
            name="md-checkmark-circle-outline"
            size={20}
            color={tintColor}
            style={{ marginTop: 6 }}
          />
        )
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }
    }
  }
);

export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
