import React from 'react';
import WebView from 'react-native-webview';
import {WebViewErrorEvent} from 'react-native-webview/lib/WebViewTypes';
import {Toast} from '../../components/Toast';
import {postApi} from '../../api';
import {getItem} from '../../data';

class BrowserScreen extends React.Component {
  componentDidMount() {
    const {route} = this.props;
    console.log({uri: route.params.url});
  }

  render() {
    const {route, navigation} = this.props;
    return (
      <WebView
        source={{uri: route.params.url}}
        onError={e => this.handleError(e, navigation, route)}
        onLoad={event => {
          console.log(event.nativeEvent);
        }}
      />
    );
  }

  handleError = (error: WebViewErrorEvent, navigation, route) => {
    console.log(error.nativeEvent);
    const {url} = error.nativeEvent;
    if (
      url.startsWith('http://localhost:8081/connect-api/') ||
      url.startsWith(`${getItem('@ip')}:8081/connect-api/`)
    ) {
      const regex = /[?&]([^=#]+)=([^&#]*)/g;
      const params = {};
      let match;
      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }
      postApi(route.params.api, params)
        .then(r => console.log(r))
        .catch(e => {
          console.log(e);
          Toast('Error connecting to API');
        });
      navigation.goBack();
    }
  };
}
export default BrowserScreen;
