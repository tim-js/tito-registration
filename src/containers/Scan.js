import React, { Component } from "react";
import {Text, View, StyleSheet, Modal, Alert} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import TitoCheckInApi from "../services/TitoCheckInApi";
import TitoAdminApi from "../services/TitoAdminApi";
import Loader from "../components/Loader";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "react-native-elements";
import { getAccountSettings } from "../redux/actions/account";
import { connect } from "react-redux";
import {withNavigationFocus} from "react-navigation";
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";

class Scan extends Component {
  state = {
    hasCameraPermission: null,
    modalVisible: false,
    scanResult: "",
    ticket: null,
    checkinListSlug: null,
    checkIns: [],
    checkinAvailable: null,
    isLoading: false,
    totalPages: 1,
    error: null,
    scanned: false
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
      ticket: null,
      checkinAvailable: null,
      error: null,
      isLoading: false,
      scanned: false
    });
  }

  componentDidMount = async () => {
    await this.loadData();
    await this._requestCameraPermission();
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.isFocused !== this.props.isFocused) {
      await this.loadData();
    }
  };

  loadData = async () => {
    this.setState({ isLoading: true });

    await this.props.getAccountSettings();
    await this.getPages();

    this.setState({ isLoading: false });
  };

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _handleBarCodeRead = async qrData => {
    this.setState({ scanned: true} );
    this.setState({ isLoading: true });
    this.showModal();

    this.setState({ scanResult: qrData });

    const splicedURI = qrData.data.split("/");
    const slug = splicedURI[splicedURI.length - 1];
    let ticketData;

    try{
      ticketData = await TitoAdminApi.getTicketData(
        this.props.accountSettings.apiKey,
        this.props.accountSettings.teamSlug,
        this.props.accountSettings.eventSlug,
        slug
      );
    } catch(e) {
      alert("The ticket was not found for this event");
      this.setState({error: `Ticket not found`});
      ticket = null;

      this.setState({
        ticket,
        checkIns: [],
        isLoading: false,
        checkinAvailable: null,
      });

      return;
    }

    const checkIns = await this.getCheckins();
    let ticket = ticketData.data.ticket;

    let isCheckedIn;
    try{
      await TitoCheckInApi.getTicket(this.props.accountSettings.checkinListSlug, ticket.slug);
      isCheckedIn = await this.getTicketStatus(checkIns, ticket.id);
      this.setState({error: null});
    } catch(e) {
      alert("The ticket is not from this checkin list");
      this.setState({error: `Not found in this checkin list`});
      ticket = null;
    }

    this.setState({
      ticket,
      checkIns: checkIns,
      isLoading: false,
      checkinAvailable: !isCheckedIn
    });
  };

  getCheckins = async (pageNumber = 1) => {
    let results = await TitoCheckInApi.getCheckins(this.props.accountSettings.checkinListSlug, pageNumber);
    let nextPage = pageNumber + 1;

    if(nextPage < this.state.totalPages) {
      return results.data.concat(await this.getCheckins(nextPage));
    } else {
      return results.data
    }
  };

  getPages = async () => {
    let results = await TitoCheckInApi.getList(this.props.accountSettings.checkinListSlug);

    this.setState({ totalPages: results.data.total_checkin_pages });
  };

  getTicketStatus = async (checkins, ticket_id) => {
    return checkins.some(checkin => { return checkin.ticket_id === ticket_id }) ;
  };

  checkin = async (modal) => {
    let ticketId = parseInt(this.state.ticket.id);
    let ticketNumber = this.state.ticket.number;

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
          text: 'Yes', onPress: async () => {
            try {
              await TitoCheckInApi.checkinTicket(this.props.accountSettings.checkinListSlug, ticketId);

              modal.hideModal();
              this.props.navigation.navigate("Dashboard");
            } catch (e) {
              this.setState({ error: e.message });
            } finally {
              this.setState({ isLoading: false });
            }
          }
        },
      ]);
  };

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
            onBarCodeScanned={ this.state.scanned ? null : this._handleBarCodeRead }
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

                { Scan._renderTicket(this.state.ticket) }

                <View style={{ marginBottom: 20 }}>
                  {this.state.ticket ? (
                    this.state.checkinAvailable ? (
                      <Button
                        icon={
                          <Ionicons
                            name="md-checkmark-circle-outline"
                            size={25}
                            color="#ffffff"
                            style={{ marginRight: 20 }}
                          />
                        }
                        onPress={ async () => this.checkin(this)}
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
                          width: "100%",
                          flexShrink: 1
                        }}
                      >
                        {this.state.error ? this.state.error : "Already Checked In"}
                      </Text>
                    )
                  ) : (
                    <Text
                      style={{
                        fontSize: 30,
                        textAlign: "center",
                        color: "#4caf50",
                        fontWeight: "bold",
                        width: "100%",
                        flexShrink: 1
                      }}
                    >
                      { this.state.error ? this.state.error : 'No ticket data' }
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

            <Button
              onPress={() => this.hideModal()}
              title="Go back"
            >
            </Button>
          </View>
        </Modal>
      </View>
    );
  }

  static _renderTicket(ticket) {
    if(!ticket){
      return;
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
    };
  };
};

const mapDispatchToProps = dispatch => ({
  getAccountSettings: () => dispatch(getAccountSettings())
});

export default withNavigationFocus(connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Scan));
