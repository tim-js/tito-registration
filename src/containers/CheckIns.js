import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Constants from "expo-constants";

import TitoCheckInApi from "../services/TitoCheckInApi";
import Loader from "../components/Loader";
import TitoAdminApi from "../services/TitoAdminApi";

class CheckIns extends Component {
  state = {
    isLoading: true,
    checkIns: [],
    error: null
  };

  componentDidMount = async () => {
    await this.getCheckIns();
  };

  getCheckIns = async () => {
    try {
      const response = await TitoCheckInApi.getCheckins(
        this.props.accountSettings.checkinListSlug
      );
      let listWithUserData = await this.addUserDataToList(response.data);

      this.setState({ checkIns: listWithUserData });
    } catch (e) {
      this.setState({ error: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={styles.statusBar} />

        {this.state.isLoading ? (
          <Loader />
        ) : this.state.error === null ? (
          this._renderList(this.state.checkIns)
        ) : (
          <Text>{this.state.error}</Text>
        )}
      </View>
    );
  }

  addUserDataToList = async (list) => {
    //@todo -> get the ticket by id if it's possible, and get the ticket Slug to use it in here :)
    return list.map(checkin => Object.assign({}, checkin, this.getUserDataFromTicket(checkin.ticket_id)));
  };

  getUserDataFromTicket = async (ticketId) => {
    return await TitoAdminApi.getTicketData(
      this.props.accountSettings.apiKey,
      this.props.accountSettings.apiKey,
      this.props.eventSlug,
      ticketId
    )
  };

  _renderList = list => {
    if (!list.length) {
      return <Text>No checkins yet</Text>;
    }

    // @Todo each ticked_id should be queried again to be able to show the name and ticket identification
    console.log(list);

    return (
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {list.map(checkin =>
          (
          <ListItem
            key={checkin.id}
            title={`${checkin.full_name} ${checkin.id}`}
            subtitle={`${checkin.ticket_id}`}
            topDivider
            subtitleStyle={{ color: "#888888" }}
          />
        ))}
      </ScrollView>
    );
  };
}


const styles = StyleSheet.create({
  statusBar: {
    height: Constants.statusBarHeight
  }
});

const mapStateToProps = () => {
  return state => {
    return {
      ...state.accountSettings
    };
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckIns);
