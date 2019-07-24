import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import TitoCheckInApi from '../services/TitoCheckInApi'
import {clearAccount, getAccountSettings} from "../redux/actions/account";
import {connect} from "react-redux";
import TitoAdminApi from "../services/TitoAdminApi";

class CheckInList extends Component {
  static navigationOptions = {
    title: 'CheckIn List Details',
  };

  state = {
    isLoading: true,
    checkInList: [],
    error: null
  };

  componentDidMount = () => {
    this.props.getAccountSettings();

    this.getCheckInList();
  };

  getCheckInList = async () => {
    try {
      let response = await TitoCheckInApi.get(`checkin_lists/${this.props.accountSettings.checkinListSlug}`);
      if(response.status === 200) {
        this.setState({ checkInList: response.data });
        this.setState({ isLoading: false });
      }
    } catch (e) {
      this.setState({ error: e.message });
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
              <Text>Title: {this.state.checkInList.title}</Text>
              <Text>Slug: {this.state.checkInList.slug}</Text>
              <Text>Tickets Count: {this.state.checkInList.tickets_count}</Text>
              <Text>Checkins Count: {this.state.checkInList.checkins_count}</Text>
            </>
            :
            <Text>{this.state.error}</Text>
        }
        
         {/*<ListView dataSource={this.state.checkInList} renderRow={(rowData) => <Text>{rowData}</Text>}/>*/}
      </View>
    );
  }
}

const makeMapStateToProps = () => {
  return state => {
    return {
      accountSettings: state.accountSettings,
    };
  };
};

const mapDispatchToProps = dispatch => ({
  getAccountSettings: () => dispatch(getAccountSettings())
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(CheckInList);
