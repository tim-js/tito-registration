import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View, Alert} from "react-native";
import {Button} from "react-native-elements";

import TitoCheckInApi from "../services/TitoCheckInApi";
import {clearAccount, getAccountSettings} from "../redux/actions/account";
import {connect} from "react-redux";
import Loader from "../components/Loader";

class Dashboard extends Component {
  state = {
    isLoading: true,
    error: null,
    checkInList: {}
  };

  componentDidMount = async () => {
    await this.props.getAccountSettings();

    console.log(this.props);

    await this.getCheckInList();
  };

  signOut = () => {
    this.props.signOut();
    this.props.navigation.navigate("SignIn");
  };

  getCheckInList = async() => {
    console.log(this.props.accountSettings.checkinListSlug);
    try {
      let response = await TitoCheckInApi.getList(this.props.accountSettings.checkinListSlug);
      if (response.status === 200) {
        this.setState({ checkInList: response.data });
      }
    } catch (e) {
      this.setState({ error: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderContent()}
        {/*<ListView dataSource={this.state.checkInList} renderRow={(rowData) => <Text>{rowData}</Text>}/>*/}
      </View>
    );
  }

  _renderContent = () => {
    const {
      title,
      slug,
      checkins_count,
      tickets_count
    } = this.state.checkInList;

    const { isLoading, error } = this.state;

    const percent =
      tickets_count > 0 ? (checkins_count * 100) / tickets_count : 0;

    if (isLoading) {
      return <Loader text="Fetching CheckIn List" />;
    }

    if (error) {
      return this._renderError(error);
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          paddingVertical: 50
        }}
      >
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{slug}</Text>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("CheckIns")}
          >
            <Text style={styles.nrCheckins}>{checkins_count}</Text>
            <Text style={styles.label}>Checkins</Text>
          </TouchableOpacity>

          {this._renderProgress(percent)}

          <Text style={styles.nrTickets}>{tickets_count}</Text>
          <Text style={styles.label}>Total Tickets</Text>
        </View>

        <View>
          <Button
            title="Scan Ticket"
            onPress={() => this.props.navigation.navigate("Scan")}
          />
          <Button
            containerStyle={{ marginTop: 20 }}
            type="clear"
            title="Sign Out"
            onPress={() => this.signOut()}
          />
        </View>
      </View>
    );
  };

  _renderError = error => {
    return (
      <View>
        <Text style={styles.title}>Couldn't get Checkin List</Text>
        <Text style={styles.subtitle}>
          "{this.props.accountSettings.checkinListSlug}"
        </Text>
        <Text>{error}</Text>
        <Button
          containerStyle={{ marginTop: 20 }}
          type="clear"
          title="Sign Out"
          onPress={() => this.signOut()}
        />
      </View>
    );
  };

  _renderProgress = percent => {
    const inner =
      percent > 0 ? (
        <View style={[styles.progressInner, { width: `${percent}%` }]} />
      ) : null;

    return <View style={styles.progressOuter}>{inner}</View>;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  subtitle: {
    color: "#888888",
    textAlign: "center"
  },
  nrCheckins: {
    fontSize: 100,
    fontWeight: "bold",
    color: "#4caf50",
    textAlign: "center"
  },
  label: { textAlign: "center" },
  nrTickets: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  progressOuter: {
    width: "100%",
    height: 14,
    borderWidth: 1,
    borderColor: "#4caf50",
    borderRadius: 7,
    marginVertical: 20,
    padding: 2
  },
  progressInner: {
    height: 8,
    backgroundColor: "#4caf50",
    borderRadius: 4,
    minWidth: 8
  }
});

const mapStateToProps = () => {
  return state => ({
    ...state.accountSettings
  });
};

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(clearAccount()),
  getAccountSettings: () => dispatch(getAccountSettings())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
