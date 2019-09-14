import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Alert} from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Constants from "expo-constants";

import TitoAdminApi from "../services/TitoAdminApi";
import Loader from "../components/Loader";
import {getEventSlug, setCheckinListSlug} from "../redux/actions/account";

class CheckinList extends Component {
  state = {
    isLoading: true,
    checkInLists: [],
    error: null
  };

  componentDidMount = async () => {
    await this.props.getEventSlug();

    await this.getCheckinLists();
  };

  getCheckinLists = async () => {
    try {
      const response = await TitoAdminApi.getCheckinLists(
        this.props.accountSettings.apiKey,
        this.props.accountSettings.teamSlug,
        this.props.eventSlug
      );

      console.log(response.data)
      this.setState({ checkInLists: response.data.checkin_lists});
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
          this._renderList(this.state.checkInLists)
        ) : (
          <Text>{this.state.error}</Text>
        )}
      </View>
    );
  }

  _renderList = list => {
    if (!list.length) {
      return <Text>No check in lists found</Text>;
    }

    return (
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {list.map(checkinList => (
            <ListItem
              key={checkinList.slug}
              title={checkinList.title}
              subtitle={checkinList.slug}
              titleStyle={ checkinList.slug === this.props.accountSettings.checkinListSlug ? { color: "#1046af" } : { color: "#888888" } }
              subtitleStyle={ checkinList.slug === this.props.accountSettings.checkinListSlug ? { color: "#4caf50" } : { color: "#888888" } }
              topDivider
              onPress={ async () => await this.saveCheckinListSlug(checkinList.slug) }
            />
          )
        )}
      </ScrollView>
    );
  };

  saveCheckinListSlug = async(checkinListSlug) => {
    this.setState({ isLoading: true });
    try {
      await this.props.setCheckinListSlug(checkinListSlug);
      this.props.navigation.navigate("Dashboard");
    } catch (e) {
      console.log('error', e);
      this.setState({ error: e.message });
      Alert.alert("Something went wrong, please try again.");
    } finally {
      this.setState({ isLoading: false });
    }
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: Constants.statusBarHeight
  }
});

const mapStateToProps = () => {
  return state => ({
    ...state.accountSettings,
    eventSlug: state.accountSettings.eventSlug
  });
};

const mapDispatchToProps = dispatch => ({
  setCheckinListSlug: slug => dispatch(setCheckinListSlug(slug)),
  getEventSlug: () => dispatch(getEventSlug())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckinList);
