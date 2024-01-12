import { useState, useEffect } from "react";
import * as React from 'react';
import Constants from 'expo-constants';
import {   
    Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,ScrollView,
  Button, TextInput,
  TouchableOpacity} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Home({navigation}){
  useEffect(() => {
		navigation.setOptions({
			headerShown: false 
		  //headerRight: () => <Button onPress={addColor} title="Add" />,
		});
  });
  
	return (
		<View style={styles.container}>
    <Text style={{fontSize:40}}>MaiChart</Text>
    <Text style={{margin:10, 
        width:windowWidth*0.7,
        textAlign:'center'
    }}>Check Rating Easily</Text>
    <View style={{padding:5}}></View>
    {/*<Button onPress={()=>{navigation.navigate("DataEntry"), {}}} color="#696969"
      style={{ backgroundColor: "#696969"}}
      title='Modify Instructors' />
    <View style={{padding:5}}></View>*/}
    <Button onPress={()=>{navigation.navigate("Metadata")}} color="#696969" style={{ backgroundColor: "#696969", marginTop:50}} title='Configuration' />
    <View style={{padding:5}}></View>
    <Button onPress={()=>{navigation.navigate("Form")}} color="#696969" style={{ backgroundColor: "#696969", marginTop:50}} title='Check' />
    <View style={{padding:5}}></View>
    <Button onPress={()=>{navigation.navigate("Bookmarklet")}} color="#696969" style={{ backgroundColor: "#696969", marginTop:50}} title='Bookmarklet' />
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
