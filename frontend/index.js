/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const noti = async message => {
    console.log(message);
    const {title, body} = message.data;
    try {
      // const channelId = await notifee.createChannel({
      //   id: 'order',
      //   name: 'Order Channel',
      //   sound: 'order'
      // });

      // Display a notification
      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: 'orders',
          sound: 'order',
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  await noti(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
