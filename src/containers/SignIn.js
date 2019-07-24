import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import TitoCheckInApi from "../services/TitoCheckInApi";
import Constants from 'expo-constants';
import { Button } from 'react-native-elements';
import {setAccount} from "../redux/actions/account";
import {connect} from "react-redux";

class SignIn extends Component {
  state = {
    error: null,
    checkinListSlug: null
  };

  static navigationOptions = {
    title: 'Tito CheckIn',
  };

  registerCheckInList = async () => {
    try {
      let response = await TitoCheckInApi.get(`checkin_lists/${this.state.checkinListSlug}`);
      if(response.status === 200) {
        this.props.setAccount(this.state.checkinListSlug);
        this.props.navigation.navigate('Dashboard');
      }
    } catch (e) {
      console.log(e);
      this.setState({ error: "Your checkin list slug cannot be found. Please review your slug and try again!" });
    }
  };

  render() {
    return (
       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(checkinListSlug) => this.setState({checkinListSlug: checkinListSlug})}
        placeholder="Your CheckIn list slug"
        />

         <Text>
         { this.state.error != null ?
           this.state.error
           :
           ''
         }
         </Text>

        <Text>Enter your checkIn list slug for using the app. This can be changed anytime in your settings page.</Text>
        <Button
          title="Register checkIn list"
          onPress={() => this.registerCheckInList() }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});


const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  setAccount: checkinListSlug => dispatch(setAccount(checkinListSlug)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);

