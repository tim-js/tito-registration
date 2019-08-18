import React, { Component } from "react";
import { View, StyleSheet, Alert } from "react-native";
import TitoCheckInApi from "../services/TitoCheckInApi";
import { Button, Input } from "react-native-elements";
import { setAccount } from "../redux/actions/account";
import { connect } from "react-redux";

class SignIn extends Component {
  state = {
    checkinListSlug: "",
    isLoading: false
  };

  static navigationOptions = {
    title: "Tito CheckIn"
  };

  registerCheckInList = async () => {
    const { checkinListSlug } = this.state;
    this.setState({ isLoading: true });
    try {
      let response = await TitoCheckInApi.getList(checkinListSlug);

      if (response.status === 200) {
        this.props.setAccount(checkinListSlug);
        this.props.navigation.navigate("Dashboard");
      }
    } catch (e) {
      this.setState({ isLoading: false });
      // console.log(e);
      Alert.alert("Invalid Checkin List Slug");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Input
          label="ti.to Check-in List Slug"
          value={this.state.checkinListSlug}
          onChangeText={checkinListSlug =>
            this.setState({ checkinListSlug: checkinListSlug })
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
  setAccount: checkinListSlug => dispatch(setAccount(checkinListSlug))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
