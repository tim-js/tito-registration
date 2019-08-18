import React, { Component } from "react";
import { Text, View, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import TitoCheckInApi from "../services/TitoCheckInApi";
import TitoAdminApi from "../services/TitoAdminApi";

import { Button } from "react-native-elements";
import { getAccountSettings } from "../redux/actions/account";
import { connect } from "react-redux";

class Scan extends Component {
  state = {
    hasCameraPermission: null,
    modalVisible: false,
    scanResult: "",
    ticket: null,
    checkinListSlug: null,
    checkIns: [],
    checkinAvailable: null,
    isLoading: false
  };

  static navigationOptions = {
    title: "Scan Ticket"
  };

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({
      modalVisible: false,
      scanResult: "",
      ticket: null
    });
  }

  componentDidMount() {
    this.props.getAccountSettings();
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _handleBarCodeRead = async qrData => {
    this.setState({ isLoading: true });
    this.showModal();

    if (this.state.scanResult) {
      this.setState({ isLoading: false });
      return;
    }

    this.setState({ scanResult: qrData });

    let splicedURI = qrData.data.split("/");
    let slug = splicedURI[splicedURI.length - 1];

    const headers = {
      Accept: "application/json",
      Authorization: "Token token=secret_live_kBSSKszg7XcZm-zuiwMD"
    };

    const [ticketData, checkIns] = await Promise.all([
      TitoAdminApi.get(`revojs/revojs2019/tickets/${slug}`, {}, headers),
      TitoCheckInApi.getCheckins(this.props.accountSettings.checkinListSlug)
    ]);

    const { ticket } = ticketData.data;

    this.setState({ ticket: ticket });
    this.setState({ checkIns: checkIns.data });

    this.checkTicketStatus();

    this.setState({ isLoading: false });
  };

  checkTicketStatus = () => {
    const checkins = this.state.checkIns;
    const ticketId = this.state.ticket.id;

    if (checkins.some(checkin => checkin.ticket_id === ticketId)) {
      this.setState({ checkinAvailable: false });
    } else {
      this.setState({ checkinAvailable: true });
    }
  };

  checkin(modal) {
    let ticketId = parseInt(this.state.ticket.release_id);

    TitoCheckInApi.post(
      `checkin_lists/${this.props.accountSettings.checkinListSlug}/checkins`,
      { checkin: { ticket_id: ticketId } }
    )
      .then(() => {
        modal.hideModal();
        this.props.navigation.navigate("CheckInList", {
          checkinListSlug: this.state.checkinListSlug
        });
      })
      .catch(error => {
        console.log(error);
        if (error.response && error.response.status === 404) {
          this.setState({ error: "Ticket not found." });
        }
      });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {this.state.hasCameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text>Camera permission is not granted</Text>
        ) : (
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            style={{ height: 1000, width: 1000 }}
            onBarCodeScanned={this._handleBarCodeRead}
          />
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.hideModal();
          }}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {this.state.isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {Scan._renderTicket(
                  this.state.ticket,
                  this.state.checkinAvailable
                )}

                <Button onPress={() => this.hideModal()} title="Scan Again" />

                {this.state.ticket && this.state.checkinAvailable ? (
                  <Button onPress={() => this.checkin(this)} title="Check In" />
                ) : (
                  <Text />
                )}
              </>
            )}
          </View>
        </Modal>
      </View>
    );
  }

  static _renderTicket(ticket, checkinAvailable) {
    if (!ticket) {
      return <Text>No ticket data</Text>;
    }

    const { first_name, last_name, number } = ticket;
    return (
      <>
        {checkinAvailable ? (
          <Text style={{ fontSize: 50 }}>Available for check in</Text>
        ) : (
          <Text style={{ fontSize: 50 }}>Ticket checked in</Text>
        )}

        <Text style={{ fontSize: 200 }}>{number}</Text>
        <Text style={{ fontSize: 30 }}>
          {first_name} {last_name}
        </Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    margin: "auto"
  },
  ticket_number: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 50
  }
});

const makeMapStateToProps = () => {
  return state => {
    return {
      accountSettings: state.accountSettings
    };
  };
};

const mapDispatchToProps = dispatch => ({
  getAccountSettings: () => dispatch(getAccountSettings())
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Scan);
