import * as React from 'react';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './components/Home.js';
import DataEntry from './components/DataEntry.js';
import Instructor from './components/Instructor.js';
import Metadata from './components/Metadata.js';
import Form from './components/Form.js';
import AcceptFriend from './components/AcceptFriend.js';
import DataManagement from './components/DataManagement.js';

////Components//////////////////////////////////////////////////////////

export default function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Form" component={Form} />
        <Stack.Screen name="AcceptFriend" component={AcceptFriend} />
        
        <Stack.Screen name="DataEntry" component={DataEntry} />
        <Stack.Screen name="Instructor" component={Instructor} />
        <Stack.Screen name="Metadata" component={Metadata} />
        <Stack.Screen name="DataManagement" component={DataManagement} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
