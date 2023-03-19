import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListItem } from 'react-native-elements';
import Constants from 'expo-constants';
import TitoAdminApi from '../services/TitoAdminApi';
import Loader from '../components/Loader';
import useAccountSettings from '../hooks/useAccountSettings';
import { RootStackParams } from '../routers/MainStackNavigation';

export default function CheckinList() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkInLists, setCheckInLists] = useState([]);

  const { settings, setSettings, getSettings } = useAccountSettings();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams, 'Main'>>();

  useEffect(() => {
    setIsLoading(true);

    getSettings()
      .then((settings) => {
        return TitoAdminApi.getCheckinLists(
          settings.apiKey,
          settings.teamSlug,
          settings.eventSlug,
        );
      })
      .then((response) => {
        if (response.status === 200) {
          setCheckInLists(response.data.checkin_lists);
        }
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.statusBar} />

      {isLoading ? (
        <Loader />
      ) : error === null ? (
        _renderList(checkInLists)
      ) : (
        <Text>{error}</Text>
      )}
    </View>
  );

  function _renderList(list: any[]) {
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
    setIsLoading(true);
    try {
      await setSettings({ ...settings, checkinListSlug });
      navigation.navigate('Main', { screen: 'Dashboard' });
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
