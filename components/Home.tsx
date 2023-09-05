import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Camera from '../screens/Camera';
import MyNFTS from '../screens/MyNFTS';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'thistle',
      }}>
      <Tab.Screen name="Camera" component={Camera} />
      <Tab.Screen name="MyNFTS" component={MyNFTS} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'black',
    color: 'thistle',
  },
});
