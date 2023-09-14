import React, {useState, useEffect} from 'react';
import {NativeBaseProvider} from 'native-base';
import AppContext from './AppContext';

import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import AppNavContainer from './src/navigations/index';
const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [CaptainMobile, setCaptainMobile] = useState('');

  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        console.log(token);
      });

    const noti = async message => {
      console.log(message);
      const {title, body} = message.data;
      try {
        const channelId = await notifee.createChannel({
          id: 'order',
          name: 'Order Channel',
          sound: 'order',
        });

        // Display a notification
        await notifee.displayNotification({
          title: title,
          body: body,
          android: {
            channelId,
            // sound: 'order'
          },
        });
      } catch (e) {
        console.log(e);
      }
    };

    messaging().onMessage(message => noti(message));
    messaging().setBackgroundMessageHandler(message => noti(message));
    messaging().onTokenRefresh(token => console.log(token));
  }, []);

  const authrequired = {
    isLogin,
    CaptainMobile,

    setIsLogin,
    setCaptainMobile,
  };

  return (
    <NativeBaseProvider>
      <AppContext.Provider value={authrequired}>
        <AppNavContainer />
      </AppContext.Provider>
    </NativeBaseProvider>
  );
};

export default App;
