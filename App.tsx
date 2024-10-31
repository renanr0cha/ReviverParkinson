import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { NativeBaseProvider, StatusBar } from "native-base";
import { useEffect, useRef } from "react";
import { THEME } from "./src/styles/theme";

import { SelectProvider } from '@mobile-reality/react-native-select-pro';
import { Subscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { getPushNotificationToken } from './src/services/getPushNotificationToken';
import './src/services/notificationConfigs';

import { Linking } from "react-native";
import { Loading } from './src/components/Loading';
import { AuthProvider } from "./src/hooks/auth";
import { Routes } from "./src/routes";
import { verifyIfInspectionNotificationsAreSet } from "./src/services/verifyIfIspectionNotificationsAreSet";
// import { testNotificationSound } from "./src/services/testNotificationSound";

const config = {
  enableStaticRendering: false,
  enableServerRendering: false
};

export default function App() {
  const getNotificationListener = useRef<Subscription>()
  const responseNotificationListener:any = useRef<Subscription>()
  const lastNotificationResponse:any = Notifications.useLastNotificationResponse()

  useEffect(() => {
    getPushNotificationToken()
  }, [])

  useEffect(() => {
    getNotificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification)
    })

    responseNotificationListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
    })



    return () => {
      if (getNotificationListener.current && responseNotificationListener.current) {
        Notifications.removeNotificationSubscription(getNotificationListener.current)
        Notifications.removeNotificationSubscription(responseNotificationListener.current)
      }
    }
  }, [])

  async function getNotifications() {
    const notifications = await Notifications.getAllScheduledNotificationsAsync()
    console.log(notifications)
  }
  
  useEffect(() => {
    
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.trigger.channelId === "medicine" &&
      lastNotificationResponse.notification.request.content.data.medId
      ){
      Linking.openURL(`reviver://medtaken/${lastNotificationResponse.notification.request.content.data.medId}/${lastNotificationResponse.notification.request.identifier}`)
      return
    }

    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.identifier === "inspection-reminder"
    ){
      console.log(lastNotificationResponse.notification.request.trigger.channelId);
      Linking.openURL(`reviver://addinfo1`)
      return
    }

    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.trigger.channelId === "inventory" &&
      lastNotificationResponse.actionIdentifier === "ok"
    ) {
      Notifications.dismissNotificationAsync(`${lastNotificationResponse.notification.request.content.data.medId}-inventory`)
      return
    }

    // testNotificationSound()

    verifyIfInspectionNotificationsAreSet()
  }, [lastNotificationResponse])
  


  getNotifications()


  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold, Roboto_500Medium })
  
  return (
    <NativeBaseProvider theme={THEME}>
      <SelectProvider>
        <StatusBar 
          barStyle='light-content'
          backgroundColor={THEME.color.primary}
          translucent
        />
        <AuthProvider>
          { fontsLoaded ? <Routes /> : <Loading/>}
        </AuthProvider>
      </SelectProvider>
    </NativeBaseProvider>
  );
}