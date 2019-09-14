import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Constants from "expo-constants";

import TitoCheckInApi from "../services/TitoCheckInApi";
import Loader from "../components/Loader";
import TitoAdminApi from "../services/TitoAdminApi";
import {getEventSlug} from "../redux/actions/account";

class CheckIns extends Component {
  state = {
    isLoading: true,
    checkIns: [],
    tickets: [],
    error: null
  };

  componentDidMount = async () => {
    await this.props.getEventSlug();
    await this.getAllTickets();
    await this.getCheckIns();
  };

  getCheckIns = async () => {
    this.setState({ isLoading: true });
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

  getAllTickets = async () => {
    this.setState({ isLoading: true });
    try {
      let tickets = await this.getTickets();
      this.setState({ allTickets: tickets });
    } catch (e) {
      this.setState({ error: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  getTickets = async (pageNumber = 1) => {
    let results = await TitoAdminApi.getAllTickets(this.props.accountSettings.apiKey, this.props.accountSettings.teamSlug, this.props.eventSlug, pageNumber);
    let nextPage = results.data.meta.next_page;

    if(nextPage) {
      return results.data.tickets.concat(await this.getTickets(nextPage));
    } else {
      return results.data.tickets
    }
  };

  addUserDataToList = async list => {
    let listIds = list.map(checkin => checkin.ticket_id);
    return this.state.allTickets.filter(ticket => listIds.includes(ticket.id));
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

  _renderList = list => {
    if (!list.length) {
      return <Text>No checkins yet</Text>;
    }

    return (
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {list.map(checkin =>
          (
          <ListItem
            key={checkin.id}
            title={`${checkin.first_name} ${checkin.last_name}` }
            subtitle={`${checkin.number}`}
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
      ...state.accountSettings,
      eventSlug: state.accountSettings.eventSlug
    };
  };
};

const mapDispatchToProps = dispatch => ({
  getEventSlug: () => dispatch(getEventSlug())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckIns);
