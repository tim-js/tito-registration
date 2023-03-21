import { useCallback, useEffect } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { isSignedIn } from '../auth';
import SignIn from '../containers/SignIn';
import BottomTabsNavigation from './BottomTabsNavigation';
import useAccountSettings from '../hooks/useAccountSettings';
import Events from '../containers/Events';
import CheckinList from '../containers/CheckinList';

export type RootStackParams = {
  SignIn: undefined;
  Events: undefined;
  CheckinList: undefined;
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
  const { getSettings } = useAccountSettings();

  const handleSignIn = useCallback(async () => {
    const signedIn = await isSignedIn();
    if (signedIn) {
      await getSettings();
      navigation.navigate('Main', { screen: 'Dashboard' });
    } else {
      navigation.navigate('SignIn');
    }
  }, [getSettings, navigation]);

  useEffect(() => {
    handleSignIn();
  }, []);

  return (
    <Stack.Navigator initialRouteName={'SignIn'} screenOptions={screenOptions}>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ title: 'Tito CheckIn' }}
      />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="CheckinList" component={CheckinList} />
      <Stack.Screen
        name="Main"
        component={BottomTabsNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default RootStackNavigator;
