import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableHighlight,
  TextInput,
  Button,
} from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
 
export default class Home extends Component {
  state = {
    apiKey: null,
    teamSlug: null,
    checkinListSlug: null,
  };

  static navigationOptions = {
    title: 'Tito CheckIn',
  };

  registerCheckInList() {
    this.props.navigation.navigate('Dashboard', { checkinListSlug: this.state.checkinListSlug });
  }

  render() {
    return (
       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(checkinListSlug) => this.setState({checkinListSlug: checkinListSlug})}
        value={this.state.checkinListSlug}
        placeholder="Your CheckIn list slug"
        />

        <Text>Enter your checkIn list slug for using the app. This can be changed anytime in your.</Text>
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
