import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import thunk from 'redux-thunk';
import axios from 'axios';
import firebase from 'firebase';

import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from "./reducers";
import {Gen} from "./gen";
import Header from "./components/Header";
import Colors from "./constants/Colors";

Gen.removeYellowWarning();
Gen.initializeFirebase();

const axiosInstance = axios.create();

const store = createStore(
    reducers,
    applyMiddleware(thunk.withExtraArgument(axiosInstance))
);


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
          <Provider store={store}>
              <View style={styles.container}>
                  <Header backgroundColor={Colors.green}/>
                    <AppNavigator />

              </View>
          </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
