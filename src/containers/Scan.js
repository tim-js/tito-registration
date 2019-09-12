import React, { Component } from "react";
import { Text, View, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import TitoCheckInApi from "../services/TitoCheckInApi";
import TitoAdminApi from "../services/TitoAdminApi";
import Loader from "../components/Loader";
import { Ionicons } from "@expo/vector-icons";

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

    const splicedURI = qrData.data.split("/");
    const slug = splicedURI[splicedURI.length - 1];

    const [ticketData, checkIns] = await Promise.all([
      TitoAdminApi.getTicketData(
        this.props.accountSettings.apiKey,
        this.props.accountSettings.apiKey,
        this.props.eventSlug,
        slug),
      TitoCheckInApi.getCheckins(this.props.accountSettings.checkinListSlug)
    ]);

    const { ticket } = ticketData.data;

    const isCheckedIn = this.getTicketStatus(checkIns.data, ticket.id);

    this.setState({
      ticket,
      checkIns: checkIns.data,
      isLoading: false,
      checkinAvailable: !isCheckedIn
    });
  };

  getTicketStatus = (checkins, ticketId) => {
    return checkins.some(checkin => checkin.ticket_id === ticketId);
  };

  checkin(modal) {
    let ticketId = parseInt(this.state.ticket.release_id);

    TitoCheckInApi.checkinTicket(
      this.props.accountSettings.checkinListSlug,
      ticketId
    )
      .then(() => {
        modal.hideModal();
        this.props.navigation.navigate("CheckInList");
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
          <Loader text="Requesting for camera permission" />
        ) : this.state.hasCameraPermission === false ? (
          <Text>Camera permission is not granted</Text>
        ) : (
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            style={StyleSheet.absoluteFillObject}
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
              <Loader />
            ) : (
              <>
                {Scan._renderTicket(this.state.ticket)}

                <View style={{ marginBottom: 20 }}>
                  {this.state.ticket && this.state.checkinAvailable ? (
                    <Button
                      icon={
                        <Ionicons
                          name="md-checkmark-circle-outline"
                          size={25}
                          color="#ffffff"
                          style={{ marginRight: 20 }}
                        />
                      }
                      onPress={() => this.checkin(this)}
                      title="Check In"
                      titleStyle={{ fontSize: 25 }}
                      buttonStyle={{
                        backgroundColor: "#4caf50",
                        paddingHorizontal: 20
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 30,
                        textAlign: "center",
                        color: "#4caf50",
                        fontWeight: "bold",
                        width: "100%"
                      }}
                    >
                      Already Checked In{" "}
                    </Text>
                  )}
                </View>

                <Button
                  onPress={() => this.hideModal()}
                  title="Scan Again"
                  titleStyle={{ fontSize: 20 }}
                  buttonStyle={{ paddingHorizontal: 20 }}
                  type="clear"
                />
              </>
            )}
          </View>
        </Modal>
      </View>
    );
  }

  static _renderTicket(ticket) {
    if (!ticket) {
      return <Text>No ticket data</Text>;
    }

    const { first_name, last_name, number, reference } = ticket;
    return (
      <>
        <Text
          style={{ fontSize: 150, fontWeight: "bold", textAlign: "center" }}
        >
          {number}
        </Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            width: "100%"
          }}
        >
          {first_name} {last_name}{" "}
        </Text>
        <Text style={{ fontSize: 30, marginBottom: 50, color: "#888888" }}>
          {reference}
        </Text>
      </>
    );
  }
}

const makeMapStateToProps = () => {
  return state => {
    return {
      ...state.accountSettings,
      eventSlug: state.accountSettings.eventSlug
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
