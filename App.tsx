import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import Tabs from './navigation/Tabs';


export default function App() {
  return (

    // base navigation for app - Tabs will do the heavier lifting
    <NavigationContainer>
       <Tabs></Tabs>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
