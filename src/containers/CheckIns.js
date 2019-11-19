import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Constants from "expo-constants";

import TitoCheckInApi from "../services/TitoCheckInApi";
import Loader from "../components/Loader";
import TitoAdminApi from "../services/TitoAdminApi";
import { getAccountSettings } from "../redux/actions/account";
import { withNavigationFocus } from 'react-navigation';

class CheckIns extends Component {
  state = {
    isLoading: true,
    checkIns: [],
    tickets: [],
    allTickets: [],
    error: null,
    total_checkin_pages: null,
    totalPages: null
  };

  componentDidMount = async () => {
    await this.loadData();
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.isFocused !== this.props.isFocused) {
      await this.loadData();
    }
  };

  loadData = async () => {
    this.setState({ isLoading: true });

    try {
      await this.props.getAccountSettings();
      await this.getPages();
      await this.getTickets();
      await this.getCheckIns();
    } catch (e) {
      this.setState({ error: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  getCheckIns = async () => {
    const tickets = await this.getAllCheckins();
    let listWithUserData = this.addUserDataToList(tickets);

    this.setState({ checkIns: listWithUserData });
  };

  getTickets = async () => {
    let tickets = await this.getAllTickets();
    this.setState({ allTickets: tickets });
  };

  getAllTickets = async (pageNumber = 1) => {
    let results = await TitoAdminApi.getAllTickets(
      this.props.accountSettings.apiKey,
      this.props.accountSettings.teamSlug,
      this.props.accountSettings.eventSlug, pageNumber
    );

    let nextPage = results.data.meta.next_page;

    if(nextPage !== null) {
      return results.data.tickets.concat(await this.getAllTickets(nextPage));
    } else {
      return results.data.tickets
    }
  };

  getPages = async () => {
    let results = await TitoCheckInApi.getList(this.props.accountSettings.checkinListSlug);

    this.setState({ totalPages: results.data.total_checkin_pages });
  };

  getAllCheckins = async (pageNumber = 1) => {
    let results = await TitoCheckInApi.getCheckins(this.props.accountSettings.checkinListSlug, pageNumber);
    let nextPage = pageNumber + 1;

    if(nextPage < this.state.totalPages) {
      return results.data.concat(await this.getAllCheckins(nextPage));
    } else {
      return results.data
    }
  };

  addUserDataToList = list => {
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
            title={CheckIns.itemTile(checkin) }
            subtitle={CheckIns.itemSubtitle(checkin)}
            topDivider
            subtitleStyle={{ color: "#888888" }}
          />
        ))}
      </ScrollView>
    );
  };

  static itemTile(ticket) {
    if(ticket.company_name) {
      return `${ticket.first_name} ${ticket.last_name} (${ticket.company_name})`
    }

    return `${ticket.first_name} ${ticket.last_name}`
  }

  static itemSubtitle(ticket) {
    return `${ticket.number} (${ticket.reference})`
  }
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
  getAccountSettings: () => dispatch(getAccountSettings())
});

export default withNavigationFocus(connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckIns));
