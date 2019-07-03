import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableHighlight,
} from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
 
export default class QrScan extends Component {
  state = {
    hasCameraPermission: null,
    modalVisible: false,
    scanResult: '',
    ticket: null,
  };

  static navigationOptions = {
    title: 'Dashboard',
  };

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({
      modalVisible: false,
      scanResult: '',
      ticket: null,
    });
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = async data => {
    if (this.state.scanResult) {
      return;
    }
    this.showModal();
    this.setState({ scanResult: data });
    // Alert.alert('Scan successful!', JSON.stringify(data));

    const res = await fetch(
      `https://api.tito.io/v3/revojs/revojs2019/tickets/${data.data}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'Token token=secret_live_kBSSKszg7XcZm-zuiwMD',
        },
      }
    );
    const ticketData = await res.json();
    this.setState({ ticket: ticketData.ticket });
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text>Camera permission is not granted</Text>
        ) : (
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeRead={this._handleBarCodeRead}
            style={{ height: 200, width: 200 }}
          />
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.hideModal();
          }}>
          <View style={{ marginTop: 22 }}>
            <View>
              {this._renderTicket(this.state.ticket)}

              <TouchableHighlight
                onPress={() => {
                  this.hideModal();
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  _renderTicket(ticket) {
    if (!ticket) {
      return <Text>No ticket data</Text>
    }

    const {first_name, last_name, number, reference} = ticket;

    return (
      <>
        <Text>{first_name} {last_name}</Text>
        <Text>{number}</Text>
        <Text>{reference}</Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});
