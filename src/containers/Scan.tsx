import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AccountSettings } from '../contexts/accountSettingsContext';
import useAccountSettings from '../hooks/useAccountSettings';
import TitoCheckInApi from '../services/TitoCheckInApi';
import TitoAdminApi from '../services/TitoAdminApi';
import { Alert, View, Text, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { RootStackParams } from '../routers/MainStackNavigation';
import Loader from '../components/Loader';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

export default function Scan() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [checkinAvailable, setCheckinAvailable] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const { settings } = useAccountSettings();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    await getPages(settings);
    setIsLoading(false);
  }, [settings]);

  useEffect(() => {
    loadData();
    requestPermission();
  }, [loadData, requestPermission]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams, 'Main'>>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {!permission || permission.status === 'undetermined' ? (
        <Loader text="Requesting for camera permission" />
      ) : !permission.granted ? (
        <Text>Camera permission is not granted</Text>
      ) : (
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanned ? null : handleBarCodeRead}
        />
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          hideModal();
        }}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {renderTicket(ticket)}

              <View style={{ marginBottom: 20 }}>
                {ticket ? (
                  checkinAvailable ? (
                    <Button
                      icon={
                        <Ionicons
                          name="md-checkmark-circle-outline"
                          size={25}
                          color="#ffffff"
                          style={{ marginRight: 20 }}
                        />
                      }
                      onPress={async () => checkin()}
                      title="Check In"
                      titleStyle={{ fontSize: 25 }}
                      buttonStyle={{
                        backgroundColor: '#4caf50',
                        paddingHorizontal: 20,
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 30,
                        textAlign: 'center',
                        color: '#4caf50',
                        fontWeight: 'bold',
                        width: '100%',
                        flexShrink: 1,
                      }}>
                      {error ? error : 'Already Checked In'}
                    </Text>
                  )
                ) : (
                  <Text
                    style={{
                      fontSize: 30,
                      textAlign: 'center',
                      color: '#4caf50',
                      fontWeight: 'bold',
                      width: '100%',
                      flexShrink: 1,
                    }}>
                    {error ? error : 'No ticket data'}
                  </Text>
                )}
              </View>

              <Button
                onPress={() => hideModal()}
                title="Scan Again"
                titleStyle={{ fontSize: 20 }}
                buttonStyle={{ paddingHorizontal: 20 }}
                type="clear"
              />
            </>
          )}

          <Button onPress={() => hideModal()} title="Go back"></Button>
        </View>
      </Modal>
    </View>
  );

  async function getPages(settings: AccountSettings) {
    const results = await TitoCheckInApi.getList(settings.checkinListSlug);
    setTotalPages(results.data.total_checkin_pages);
  }

  async function handleBarCodeRead(qrData) {
    setScanned(true);
    setIsLoading(true);
    showModal();

    setScanResult(qrData);

    const splicedURI = qrData.data.split('/');
    const slug = splicedURI[splicedURI.length - 1];
    let ticketData;

    try {
      ticketData = await TitoAdminApi.getTicketData(
        settings.apiKey,
        settings.teamSlug,
        settings.eventSlug,
        slug,
      );
    } catch (e) {
      Alert.alert('The ticket was not found for this event');
      setError(`Ticket not found`);

      setIsLoading(false);
      setTicket(null);
      setCheckIns([]);
      setCheckinAvailable(null);

      return;
    }

    const checkIns = await getCheckins();
    let ticket = ticketData.data.ticket;

    let isCheckedIn;
    try {
      await TitoCheckInApi.getTicket(settings.checkinListSlug, ticket.slug);
      isCheckedIn = getTicketStatus(checkIns, ticket.id);
      setError(null);
    } catch (e) {
      Alert.alert('The ticket is not from this checkin list');
      setError(`Not found in this checkin list`);
      ticket = null;
    }

    setIsLoading(false);
    setTicket(ticket);
    setCheckIns(checkIns);
    setCheckinAvailable(!isCheckedIn);
  }

  async function getCheckins(pageNumber = 1) {
    const results = await TitoCheckInApi.getCheckins(
      settings.checkinListSlug,
      pageNumber,
    );
    const nextPage = pageNumber + 1;

    if (nextPage < totalPages) {
      return results.data.concat(await getCheckins(nextPage));
    } else {
      return results.data;
    }
  }

  function showModal() {
    setModalVisible(true);
  }

  function hideModal() {
    setModalVisible(false);
    setScanResult('');
    setTicket(null);
    setCheckinAvailable(null);
    setError(null);
    setIsLoading(false);
    setScanned(false);
  }

  function getTicketStatus(checkins: any[], ticket_id: string) {
    return checkins.some((checkin) => {
      return checkin.ticket_id === ticket_id;
    });
  }

  async function checkin() {
    const ticketId = parseInt(ticket.id);
    const ticketNumber = ticket.number;

    Alert.alert(
      'Check in',
      `Are you sure you want to check in the ticket: ${ticketNumber}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await TitoCheckInApi.checkinTicket(
                settings.checkinListSlug,
                ticketId,
              );

              hideModal();
              navigation.navigate('Main', { screen: 'Dashboard' });
            } catch (e) {
              setError(e.message);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  }

  function renderTicket(ticket) {
    if (!ticket) {
      return;
    }

    const { first_name, last_name, number, reference } = ticket;
    return (
      <>
        <Text
          style={{ fontSize: 150, fontWeight: 'bold', textAlign: 'center' }}>
          {number}
        </Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
          }}>
          {first_name} {last_name}{' '}
        </Text>
        <Text style={{ fontSize: 30, marginBottom: 50, color: '#888888' }}>
          {reference}
        </Text>
      </>
    );
  }
}
