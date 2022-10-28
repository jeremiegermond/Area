import React from 'react';
import WebView from 'react-native-webview';
import {Toast} from '../../components/Toast';
import {postApi} from '../../api';
import {getItem} from '../../data';
import {NativeEvent} from 'react-native-reanimated/lib/types';

class BrowserScreen extends React.Component {
  render() {
    const {route, navigation} = this.props;
    return (
      <WebView
        source={{uri: route.params.url}}
        onError={e => this.handleEvent(e.nativeEvent, navigation, route)}
        onLoad={e => this.handleEvent(e.nativeEvent, navigation, route)}
      />
    );
  }

  handleEvent = async (event: NativeEvent, navigation, route) => {
    const {url} = event;
    console.log(event);
    if (
      url.startsWith('http://localhost:8081/connect-api/') ||
      url.startsWith(`${await getItem('@ip')}:8081/connect-api/`)
    ) {
      const regex = /[?&]([^=#]+)=([^&#]*)/g;
      const params = {};
      let match;
      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }
      postApi(route.params.api, params)
        .then(() => console.log(`${route.params.api} added`))
        .catch(e => {
          console.log(e);
          Toast('Error connecting to API');
        });
      navigation.goBack();
    }
  };
}
export default BrowserScreen;
