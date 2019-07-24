import React, {Component} from 'react';
import {Button, View} from 'react-native';
import {connect} from 'react-redux';
import {getAccountSettings, clearAccount} from "../redux/actions/account";

class Dashboard extends Component {
  static navigationOptions = {
    title: 'Dashboard',
  };

  componentDidMount() {
    this.props.getAccountSettings();
  }

  signOut = () => {
    this.props.signOut();
    this.props.navigation.navigate("SignIn");
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Check In list"
          onPress={() => this.props.navigation.navigate('CheckInList') }
        />
        {/*<Button*/}
        {/*  title="Tickets list"*/}
        {/*  onPress={() => this.props.navigation.navigate('CheckIns', { checkinListSlug: this.state.checkinListSlug } ) }*/}
        {/*/>*/}
        <Button
          title="Scan Ticket"
          onPress={() => this.props.navigation.navigate('QrScan') }
        />

        <Button
          title="Sign Out"
          onPress={() => this.signOut()}
        />
      </View>
    );
  }
}


const makeMapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(clearAccount()),
  getAccountSettings: () => dispatch(getAccountSettings())
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(Dashboard);
