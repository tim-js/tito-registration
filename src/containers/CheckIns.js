import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Constants from "expo-constants";

import TitoCheckInApi from "../services/TitoCheckInApi";
import Loader from "../components/Loader";

class CheckIns extends Component {
  state = {
    isLoading: true,
    checkIns: [],
    error: null
  };

  componentDidMount = () => {
    this.getCheckIns();
  };

  getCheckIns = async () => {
    try {
      const response = await TitoCheckInApi.getCheckins(
        this.props.accountSettings.checkinListSlug
      );

      this.setState({ checkIns: response.data });
    } catch (e) {
      this.setState({ error: error.message });
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
          this._renderlist(this.state.checkIns)
        ) : (
          <Text>{this.state.error}</Text>
        )}
      </View>
    );
  }

  _renderlist = list => {
    if (!list.length) {
      return <Text>No checkins yet</Text>;
    }

    return (
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {list.map(checkin => (
          <ListItem
            key={checkin.id}
            title={`Fullname should be here ${checkin.id}`}
            subtitle={`Ticket code should go here ${checkin.ticket_id}`}
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
      accountSettings: state.accountSettings
    };
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckIns);
