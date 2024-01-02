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
import Checkbox from 'expo-checkbox';
import Storage from 'expo-storage';
import { useIsFocused } from '@react-navigation/native';

const format = [
  {"rank":"LTA", "name":"Runner", "service":"Regular", "personType":"Permstaff", isPresent:true},
  {"rank":"LTC", "name":"Boss", "service": "Regular", "personType":"Permstaff",isPresent:true},
  {"rank":"CPL", "name":"Cadet Material", "service": "NSF","personType":"Permstaff", isPresent:true},
  {"rank":"PTE", "name":"Chao Keng", "service": "NSF", "personType":"Permstaff", isPresent:true},
];

export default function DataManagement({navigation, route}){  
	// Navigation ////////////////////////////////////
  useEffect(() => {
  });
  
  /*
  //https://stackoverflow.com/questions/46504660/refresh-previous-screen-on-goback
  const isFocused = useIsFocused();
  useEffect(() => {
    isFocused && (()=>{
      setListData(listData); // Update on Refreshing page
    })()
  },[isFocused]);
  */
  
  // Component State Management /////////////////////////////
  const [storedData, setStoredData] = useState(""); 

  // Persistent Storage //////////////////////////////////////
  // Loading Data //////////////////////////////
  useEffect(()=>{
    Storage.getItem({ key: `staff`}).then((value)=>{
      let data = { 'staff':JSON.parse(value) };
      setStoredData( JSON.stringify(data) );
    });
  }, []);

  async function saveFromTextData(data){
    await Storage.setItem({ key: `staff`, value: JSON.stringify(JSON.parse(data).staff) });
  }
  function returnBackWithUpdatedTextData(data){
      route.params.setListData(JSON.parse(data).staff);
  }
  //// Main View ////////////////////////////////////////////////////////
  return (
    <View style={styles.container}>
      <TextInput
           style={{
               margin: 'auto',
               marginTop:20,
               borderWidth: 1,
               height:"50%",
               width: "80%", 
               padding: 10,
               borderColor: "#ccc"
             }}
           value={storedData}
           onChangeText={(text) => {
               setStoredData(text);
            }}
            
            multiline={true}
         ></TextInput>
      <View style={{padding:10}}></View>
      <Button onPress={()=>{
          saveFromTextData(storedData).then(()=>{
            navigation.goBack();
            returnBackWithUpdatedTextData(storedData);
          });
        }} title="Save" />  
      <View style={{padding:10}}></View>
      <Button onPress={()=>{
            let newTextData = JSON.stringify({staff:format});
            saveFromTextData(newTextData).then(()=>{
                navigation.goBack();
                returnBackWithUpdatedTextData(newTextData);
            });
          }} title="Reset all Data" /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  item: {  
        padding: 10,  
        fontSize: 18,  
        height: 44,  
    },  
});
