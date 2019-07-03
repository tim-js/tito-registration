import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text
} from 'react-native';

export default class Dashboard extends Component {
  static navigationOptions = {
    title: 'Dashboard',
  };

  state = {
    checkinListSlug: null
  }

  componentDidMount() { 
    this.setState({checkinListSlug: this.props.navigation.getParam("checkinListSlug")})
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Check In list"
          onPress={() => this.props.navigation.navigate('CheckInList', { checkinListSlug: this.state.checkinListSlug } ) }
        />
      </View>
    );
  }
}
