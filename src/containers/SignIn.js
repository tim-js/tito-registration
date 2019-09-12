import React, { Component } from "react";
import { View, StyleSheet, Alert } from "react-native";
import TitoAdminApi from "../services/TitoAdminApi";

import { Button, Input } from "react-native-elements";
import { setAccount } from "../redux/actions/account";
import { connect } from "react-redux";

class SignIn extends Component {
  state = {
    apiKey: "",
    teamSlug: "",
    isLoading: false
  };

  static navigationOptions = {
    title: "Tito CheckIn",
    headerTitleStyle: {
      width: "100%"
    }
  };

  registerCheckInList = async () => {
    const { apiKey, teamSlug } = this.state;
    this.setState({ isLoading: true });

    try {
      let response = await TitoAdminApi.getEvents(apiKey, teamSlug);

      if (response.status === 200) {
        await this.props.setAccount(apiKey, teamSlug);
        this.props.navigation.navigate("Events");
      }

    } catch (e) {
      console.log(e);
      Alert.alert("Invalid Credentials");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Input
          label="ti.to Api key"
          value={this.state.apiKey}
          onChangeText={apiKey =>
            this.setState({ apiKey: apiKey })
          }
          containerStyle={styles.input}
        />

        <Input
          label="ti.to Team Slug"
          value={this.state.teamSlug}
          onChangeText={teamSlug =>
            this.setState({ teamSlug: teamSlug })
          }
          containerStyle={styles.input}
        />

        <Button
          title="Register"
          onPress={() => this.registerCheckInList()}
          loading={this.state.isLoading}
          disabled={this.state.isLoading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },
  input: {
    marginTop: 5,
    marginBottom: 30,
    paddingHorizontal: 0
  }
});

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  setAccount: (apiKey, teamSlug) => dispatch(setAccount(apiKey, teamSlug))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
