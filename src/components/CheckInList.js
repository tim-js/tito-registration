import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ListView
} from 'react-native';

import TitoCheckInApi from '../services/TitoCheckInApi'

export default class CheckInList extends Component {
  static navigationOptions = {
    title: 'Check In List Details',
  };

  state = {
    isLoading: true,
    checkInList: []
  }
  
  componentDidMount = () => {
    this,this.getCheckInList();
  };


  getCheckInList = () => {
    TitoCheckInApi.get(`checkin_lists/${this.props.navigation.getParam('checkinListSlug')}`).then(response => {
      this.setState({checkInList: response.data});
      this.setState({isLoading: false});
    })
  }

  
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        
        {
          this.state.isLoading ? 
          <Text>"Waiting dor data"</Text>
          :
          <>
            <Text>Title: {this.state.checkInList.title}</Text>
            <Text>Slug: {this.state.checkInList.slug}</Text>
            <Text>Tickets Count: {this.state.checkInList.tickets_count}</Text>
            <Text>Checkins Count: {this.state.checkInList.checkins_count}</Text>
          </>
        }
        
        {/* <ListView dataSource={this.state.checkInList} renderRow={(rowData) => <Text>{rowData}</Text>}/> */}
      </View>
    );
  }
}
