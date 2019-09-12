import React from 'react';
import "react-native-gesture-handler";
import { ThemeProvider } from 'react-native-elements';
import { createRootNavigator } from "./src/router";
import { createAppContainer } from 'react-navigation';
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { isSignedIn } from "./src/auth";

export default class App extends React.Component  {
  state = {
    signedIn: false,
    checkedSignIn: false
  };

  async componentDidMount() {
    this.setState({ signedIn: await isSignedIn(), checkedSignIn: true });
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything
    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    const Container = createAppContainer(Layout);

    return (
        <ThemeProvider>
          <Provider store={store}>
            <Container/>
          </Provider>
        </ThemeProvider>
    );
  }
}