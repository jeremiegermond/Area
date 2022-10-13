import React from 'react';
import WebView from 'react-native-webview';
import {WebViewErrorEvent} from 'react-native-webview/lib/WebViewTypes';
import {Toast} from '../../components/Toast';
import {postApi} from '../../api';

class BrowserScreen extends React.Component {
  webview = null;

  render() {
    const {route, navigation} = this.props;
    return (
      <WebView
        ref={ref => (this.webview = ref)}
        source={{uri: route.params.url}}
        onError={e => this.handleError(e, navigation, route)}
      />
    );
  }

  handleError = (error: WebViewErrorEvent, navigation, route) => {
    const {url} = error.nativeEvent;
    if (url.startsWith('http://localhost:8081/connect-api/')) {
      const regex = /[?&]([^=#]+)=([^&#]*)/g;
      const params = {};
      let match;
      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }
      postApi(route.params.api, params)
        .then()
        .catch(() => Toast('Error connecting to API'));
      navigation.goBack();
    }
  };
}
export default BrowserScreen;
