import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import GlobalStateProvider from './globalState/GlobalStateContext';
import Home from './components/Home';
import Preview from './screens/Preview';
import AddMetadata from './screens/AddMetadata';
import Minted from './screens/Minted';

export default function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createStackNavigator();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <GlobalStateProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Preview" component={Preview} />
            <Stack.Screen name="AddMetadata" component={AddMetadata} />
            <Stack.Screen name="Minted" component={Minted} />
          </Stack.Navigator>
        </SafeAreaView>
      </GlobalStateProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
