import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Constants from "expo-constants";
import TitoAdminApi from "../services/TitoAdminApi"
import Loader from "../components/Loader";
import {setEventSlug, getAccountSettings, getEventSlug} from "../redux/actions/account";

class Events extends Component {
  state = {
    isLoading: true,
    error: null,
    events: []
  };

  componentDidMount = async () => {
    await this.props.getAccountSettings();
    await this.props.getEventSlug();

    await this.getEvents(this.props.accountSettings.apiKey, this.props.accountSettings.teamSlug);
  };

  getEvents = async (apiKey, teamSlug) => {
    try {
      let response = await TitoAdminApi.getEvents(apiKey, teamSlug);

      if (response.status === 200) {
        this.setState({ events: response.data.events });
        this.setState({ isLoading: false });
      }
    } catch (e) {
      console.log('error', e);
      this.setState({ error: e.message });
      Alert.alert("Invalid Credentials");
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
          this._renderList(this.state.events)
        ) : (
          <Text>{this.state.error}</Text>
        )}
      </View>
    );
  }

  _renderList = list => {
    if (!list.length) {
      return <Text>No upcoming events</Text>;
    }

    return (
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {list.map(event => (
          <ListItem
            key={ `${event.slug}` }
            title={ `${event.title}` }
            subtitle={ `${event.description}` }
            titleStyle={ event.slug === this.props.eventSlug ? { color: "#1046af" } : { color: "#888888" } }
            subtitleStyle={ event.slug === this.props.eventSlug ? { color: "#4caf50" } : { color: "#888888" } }
            onPress={ async () => await this.saveEvent(event.slug) }
            topDivider
          />
        ))}
      </ScrollView>
    );
  };

  saveEvent = async (eventSlug) => {
    this.setState({ isLoading: true });
    try {
      await this.props.setEventSlug(eventSlug);
      this.props.navigation.navigate("CheckinList");
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
  return state => {
    return {
      ...state.accountSettings,

    };
  };
};

const mapDispatchToProps = dispatch => ({
  getAccountSettings: () => dispatch(getAccountSettings()),
  setEventSlug: eventSlug => dispatch(setEventSlug(eventSlug)),
  getEventSlug: () => dispatch(getEventSlug())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Events);
