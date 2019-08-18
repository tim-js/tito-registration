import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import TitoCheckInApi from '../services/TitoCheckInApi'

export default class CheckIns extends Component {
  static navigationOptions = {
    title: 'CheckIns',
  };

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
      console.log(response.data);
    } catch (e) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {
          this.state.isLoading ?
            <Text>Waiting for data</Text>
            :
            this.state.error === null ?
              <>
                <Text>Id: {this.state.checkIns.id}</Text>
                <Text>Ticket Id: {this.state.checkInList.ticket_id}</Text>
              </>
              :
              <Text>{this.state.error}</Text>
        }
      </View>
    );
  }
}
