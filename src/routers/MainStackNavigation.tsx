import { useEffect, useState } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { isSignedIn } from '../auth';
import SignIn from '../containers/SignIn';
import BottomTabsNavigation from './BottomTabsNavigation';

export type RootStackParams = {
  SignIn: undefined;
  Main: { screen: 'Dashboard' | 'Events' | 'CheckinList' | 'Scan' };
};

const Stack = createNativeStackNavigator<RootStackParams>();

const screenOptions: NativeStackNavigationOptions = {
  headerBackTitleVisible: false, // removes back button label (usually is previous screen name) iOS only
  headerShadowVisible: false, // removes action bar shadow Android&iOS
  headerTintColor: '#000000', //set action bar icon color
};

function RootStackNavigator() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams, 'Main'>>();

  useEffect(() => {
    isSignedIn().then((res) => {
      if (res) {
        navigation.navigate('Main', { screen: 'Dashboard' });
      }
    });
  }, []);

  return (
    <Stack.Navigator initialRouteName={'SignIn'} screenOptions={screenOptions}>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ title: 'Tito CheckIn' }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabsNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default RootStackNavigator;
