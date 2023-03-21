import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListItem } from 'react-native-elements';
import Constants from 'expo-constants';
import TitoAdminApi, { CheckinListSummary } from '../services/TitoAdminApi';
import Loader from '../components/Loader';
import useAccountSettings from '../hooks/useAccountSettings';
import { RootStackParams } from '../routers/MainStackNavigation';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function CheckinList() {
  const { settings, setSettings } = useAccountSettings();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams, 'Main'>>();

  const { data, error, isLoading } = useQuery<CheckinListSummary[], AxiosError>(
    ['checkinLists', settings.apiKey, settings.teamSlug, settings.eventSlug],
    async () => {
      const response = await TitoAdminApi.getCheckinLists(
        settings.apiKey,
        settings.teamSlug,
        settings.eventSlug,
      );
      return response.data.checkin_lists;
    },
    {
      enabled: !!settings.apiKey && !!settings.teamSlug && !!settings.eventSlug,
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

  function _renderList(list: CheckinListSummary[]) {
    if (!list.length) {
      return <Text>No check in lists found</Text>;
    }

    return (
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {list.map((checkinList) => (
          <ListItem
            key={checkinList.slug}
            topDivider
            onPress={async () => await saveCheckinListSlug(checkinList.slug)}>
            <ListItem.Content>
              <ListItem.Title
                style={
                  checkinList.slug === settings.checkinListSlug
                    ? { color: '#1046af' }
                    : { color: '#888888' }
                }>
                {checkinList.title}
              </ListItem.Title>
              <ListItem.Subtitle
                style={
                  checkinList.slug === settings.checkinListSlug
                    ? { color: '#4caf50' }
                    : { color: '#888888' }
                }>
                {checkinList.slug}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
    );
  }

  async function saveCheckinListSlug(checkinListSlug: string) {
    await setSettings({ ...settings, checkinListSlug });
    navigation.navigate('Main', { screen: 'Dashboard' });
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: Constants.statusBarHeight,
  },
});
