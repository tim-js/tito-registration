import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAccountSettings from '../hooks/useAccountSettings';
import TitoAdminApi from '../services/TitoAdminApi';
import { RootStackParams } from '../routers/MainStackNavigation';

export default function SignIn() {
  const [apiKey, setApiKey] = useState('');
  const [teamSlug, setTeamSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { settings, setSettings } = useAccountSettings();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams, 'Main'>>();

  const registerCheckInList = async () => {
    setIsLoading(true);

    try {
      const response = await TitoAdminApi.getEvents(apiKey, teamSlug);

      if (response.status === 200) {
        await setSettings({ ...settings, apiKey, teamSlug });
        navigation.navigate('Main', { screen: 'Events' });
      }
    } catch (e) {
      Alert.alert('Invalid Credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="ti.to Api key"
        value={apiKey}
        onChangeText={(apiKey) => setApiKey(apiKey)}
        containerStyle={styles.input}
      />

      <Input
        label="ti.to Team Slug"
        value={teamSlug}
        onChangeText={(teamSlug) => setTeamSlug(teamSlug)}
        containerStyle={styles.input}
      />
      <Button
        title="Register"
        onPress={registerCheckInList}
        loading={isLoading}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginTop: 5,
    marginBottom: 30,
    paddingHorizontal: 0,
  },
});
