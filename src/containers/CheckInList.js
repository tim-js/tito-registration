import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import TitoCheckInApi from "../services/TitoCheckInApi";
// import { clearAccount, getAccountSettings } from "../redux/actions/account";
import { connect } from "react-redux";
import Loader from "../components/Loader";

class CheckInList extends Component {
  state = {
    isLoading: true,
    checkInList: {},
    error: null
  };

  componentDidMount = () => {
    this.getCheckInList();
  };

  getCheckInList = async () => {
    try {
      let response = await TitoCheckInApi.getList(
        this.props.accountSettings.checkinListSlug
      );
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
      tickets_count,
      checkins_count
    } = this.state.checkInList;

    const { isLoading, error } = this.state;

    const percent = (checkins_count * 100) / tickets_count;

    if (isLoading) {
      return <Loader text="Fetching CheckIn List" />;
    }

    if (error) {
      return this._renderError(error);
    }

    return (
      <>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{slug}</Text>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("CheckIns")}
        >
          <Text style={styles.nrCheckins}>{checkins_count}</Text>
          <Text style={styles.label}>Checkins</Text>
        </TouchableOpacity>

        <View style={styles.progressOuter}>
          <View style={[styles.progressInner, { width: percent }]} />
        </View>

        <Text style={styles.nrTickets}>{tickets_count}</Text>
        <Text style={styles.label}>Total Tickets</Text>
      </>
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
      </View>
    );
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
    marginBottom: 50,
    textAlign: "center"
  },
  nrCheckins: {
    fontSize: 100,
    fontWeight: "bold",
    color: "#03a9f4",
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
    height: 12,
    borderWidth: 1,
    borderColor: "#03a9f4",
    borderRadius: 6,
    marginVertical: 20
  },
  progressInner: {
    height: 10,
    backgroundColor: "#03a9f4",
    borderRadius: 5
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
  // getAccountSettings: () => dispatch(getAccountSettings())
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(CheckInList);
