import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListItem } from 'react-native-elements';
import Constants from 'expo-constants';
import TitoAdminApi, { Event } from '../services/TitoAdminApi';
import useAccountSettings from '../hooks/useAccountSettings';
import { RootStackParams } from '../routers/MainStackNavigation';
import Loader from '../components/Loader';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function Events() {
  const { settings, setSettings } = useAccountSettings();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams, 'Main'>>();

  const { data, error, isLoading } = useQuery<Event[], AxiosError>(
    ['events', settings.apiKey, settings.teamSlug],
    async () => {
      const response = await TitoAdminApi.getEvents(
        settings.apiKey,
        settings.teamSlug,
      );
      return response.data.events;
    },
    {
      enabled: !!settings.apiKey && !!settings.teamSlug,
      onError: () => {
        Alert.alert('Invalid Credentials');
      },
    },
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.statusBar} />

      {isLoading ? (
        <Loader />
      ) : error === null ? (
        _renderList(data)
      ) : (
        <Text>{error.message}</Text>
      )}
    </View>
  );

  function _renderList(list: Event[]) {
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
    await setSettings({ ...settings, eventSlug });

    navigation.navigate('CheckinList');
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: Constants.statusBarHeight,
  },
});
