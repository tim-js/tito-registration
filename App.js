import React, { Component } from 'react';
import "react-native-gesture-handler";
import {createStackNavigator, createAppContainer} from 'react-navigation';
import Home from './src/components/Home'
import CheckInList from './src/components/CheckInList'
import Dashboard from './src/components/Dashboard'
import QrScan from './src/components/QrScan'

const AppNavigator = createStackNavigator(
  {
    Home: Home,
    CheckInList: CheckInList,
    Dashboard: Dashboard,
    QrScan: QrScan,
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
   return <AppContainer />;
  }
}