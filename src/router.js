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
    Dashboard,
    Scan,
    CheckIns
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
