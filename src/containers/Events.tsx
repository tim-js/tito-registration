import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListItem } from 'react-native-elements';
import Constants from 'expo-constants';
import TitoAdminApi from '../services/TitoAdminApi';
import useAccountSettings from '../hooks/useAccountSettings';
import { RootStackParams } from '../routers/MainStackNavigation';
import Loader from '../components/Loader';

export default function Events() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  const { settings, setSettings } = useAccountSettings();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams, 'Main'>>();

  useEffect(() => {
    TitoAdminApi.getEvents(settings.apiKey, settings.teamSlug)
      .then((response) => {
        if (response.status === 200) {
          setEvents(response.data.events);
        }
      })
      .catch((e) => {
        setError(e.message);
        Alert.alert('Invalid Credentials');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [settings.apiKey, settings.teamSlug]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.statusBar} />

      {isLoading ? (
        <Loader />
      ) : error === null ? (
        _renderList(events)
      ) : (
        <Text>{error}</Text>
      )}
    </View>
  );

  function _renderList(list: any[]) {
    if (!list.length) {
      return <Text>No upcoming events</Text>;
    }

    return (
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {list.map((event) => (
          <ListItem
            key={`${event.slug}`}
            onPress={async () => await saveEvent(event.slug)}
            topDivider>
            <ListItem.Content>
              <ListItem.Title
                style={
                  event.slug === settings.eventSlug
                    ? { color: '#1046af' }
                    : { color: '#888888' }
                }>
                {event.title}
              </ListItem.Title>
              <ListItem.Subtitle
                style={
                  event.slug === settings.eventSlug
                    ? { color: '#4caf50' }
                    : { color: '#888888' }
                }>{`${
                event.description || 'Description unavailable'
              }`}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
    );
  }

  async function saveEvent(eventSlug: string) {
    setIsLoading(true);

    try {
      await setSettings({ ...settings, eventSlug });
      navigation.navigate('Main', { screen: 'CheckinList' });
    } catch (e) {
      setError(e.message);
      Alert.alert('Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: Constants.statusBarHeight,
  },
});
