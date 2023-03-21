import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Loader from '../components/Loader';
import useAccountSettings from '../hooks/useAccountSettings';
import TitoCheckInApi, { CheckinList } from '../services/TitoCheckInApi';
import { RootStackParams } from '../routers/MainStackNavigation';
import { Button } from 'react-native-elements';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function Dashboard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams, 'Main'>>();

  const { settings, clearSettings } = useAccountSettings();

  const { data, error, isLoading } = useQuery<CheckinList, AxiosError>(
    ['checkinList', settings.checkinListSlug],
    async () => {
      console.log('fetching checkin list');
      const response = await TitoCheckInApi.getList(settings.checkinListSlug);
      console.log(response.data);
      return response.data;
    },
    { enabled: !!settings.checkinListSlug },
  );

  const { title, slug, checkins_count, tickets_count } = data || {
    title: '',
    slug: '',
    checkins_count: 0,
    tickets_count: 0,
  };

  const percent =
    tickets_count > 0 ? (checkins_count * 100) / tickets_count : 0;

  if (isLoading) {
    return <Loader text="Fetching CheckIn List Info" />;
  }

  if (error) {
    return renderError(error.message);
  }
  if (!settings.checkinListSlug) {
    return renderError(
      'No CheckIn List selected. Go to the Checkin List and select one.',
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        paddingVertical: 50,
      }}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{slug}</Text>
      </View>

      <View>
        <TouchableOpacity
          onPress={
            () => {} // navigation.navigate('Main', { screen: 'CheckinList' })
          }>
          <Text style={styles.nrCheckins}>{checkins_count}</Text>
          <Text style={styles.label}>Checkins</Text>
        </TouchableOpacity>

        {renderProgress(percent)}

        <Text style={styles.nrTickets}>{tickets_count}</Text>
        <Text style={styles.label}>Total Tickets</Text>
      </View>
      <View>
        <Button
          title="Scan Ticket"
          onPress={() => navigation.navigate('Main', { screen: 'Scan' })}
        />
        <Button
          containerStyle={{ marginTop: 20 }}
          type="clear"
          title="Sign Out"
          onPress={async () => {
            await clearSettings();
            navigation.navigate('SignIn');
          }}
        />
      </View>
    </View>
  );

  function renderError(error) {
    return (
      <View>
        <Text style={styles.title}>Couldn&apos;t get Checkin List</Text>
        <Text style={styles.subtitle}>
          &quot;{settings.checkinListSlug}&quot;
        </Text>
        <Text>{error}</Text>
        <Button
          containerStyle={{ marginTop: 20 }}
          type="clear"
          title="Sign Out"
          onPress={() => signOut()}
        />
      </View>
    );
  }

  function renderProgress(percent) {
    const inner =
      percent > 0 ? (
        <View style={[styles.progressInner, { width: `${percent}%` }]} />
      ) : null;

    return <View style={styles.progressOuter}>{inner}</View>;
  }

  function signOut() {
    clearSettings();
    navigation.navigate('SignIn');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#888888',
    textAlign: 'center',
  },
  nrCheckins: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#4caf50',
    textAlign: 'center',
  },
  label: { textAlign: 'center' },
  nrTickets: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressOuter: {
    width: '100%',
    height: 14,
    borderWidth: 1,
    borderColor: '#4caf50',
    borderRadius: 7,
    marginVertical: 20,
    padding: 2,
  },
  progressInner: {
    height: 8,
    backgroundColor: '#4caf50',
    borderRadius: 4,
    minWidth: 8,
  },
});
