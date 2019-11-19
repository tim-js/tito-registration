import React from "react";
import {
  createSwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import SignIn from "./containers/SignIn";
import Dashboard from "./containers/Dashboard";
import Scan from "./containers/Scan";
import CheckinList from "./containers/CheckinList"
import Events from "./containers/Events"
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
  },
  Events: {
    screen: Events,
    navigationOptions: {
      headerStyle,
      title: 'Choose the event',
    }
  },
  CheckinList: {
    screen: CheckinList,
    navigationOptions: {
      headerStyle,
      title: 'Choose the checkin list',
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
    CheckinList: {
      screen: CheckinList,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons
            name="md-list"
            size={20}
            color={tintColor}
            style={{ marginTop: 6 }}
          />
        )
      }
    },
    Events: {
      screen: Events,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons
            name="md-list-box"
            size={20}
            color={tintColor}
            style={{ marginTop: 6 }}
          />
        )
      }
    },
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
