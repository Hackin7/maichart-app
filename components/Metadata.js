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
import storageHelper from '../helpers/storageHelper.js';
import Storage from 'expo-storage';

const fields = [
  {"name":"Friend Code"},
  {"name":"Custom Timeout"},
  {"name":"Custom Form URL"},
  {"name":"Custom Bookmarklet"},
];

let run = false;
export default function Metadata({navigation, route}){
  console.log("<<<<<< Metadata >>>>>>>>>>>>>>>>>>>>");

  let [fieldVars, setFieldVars] = useState([]);
  
  async function changeFieldVars(data){
    console.log("### set ##################");
    console.log(data);
    //setFieldVars(data);
    await Storage.setItem({ key: `metadata`, value: JSON.stringify(data) });
  }
  
  async function loadData(){
    let metadata = storageHelper.getMetadata(await Storage.getItem({ key: `metadata` }));
    console.log(metadata);
    let fieldVarsValues = [];
    fieldVarsValues.push(metadata["friendCode"]);
    fieldVarsValues.push(metadata["timeout"]);
    fieldVarsValues.push(metadata["url"]);
    fieldVarsValues.push(metadata["bookmarklet"]);
    //fieldVarsValues.push(metadata["url"]);
    setFieldVars(fieldVarsValues);
    console.log(fieldVars);
  }
  
  useEffect(() => { 
    console.log("### fieldvars ##################");
    console.log(fieldVars);
    console.log("### others ##################");
  	loadData();
  }, []);
  
  function saveData(){
    let data = {
      "friendCode": fieldVars[0], 
      "timeout": fieldVars[1], 
      "url": fieldVars[2], 
      "bookmarklet": fieldVars[3], 
    };
    Storage.setItem({ key: `metadata`, value: JSON.stringify(data) })
    .then(() => {
      console.log("saved");
      navigation.goBack();
    }, (err) => {console.log(err);})
  }

  return (
    <View style={styles.container}>
    {
      fields.map((item, index) => {
        return (<View style={[styles.item, { flexDirection: "row" }]}  >
          <Text>{item.name}: </Text>
          {
            item.type == "checkbox" 
            ?
            <Checkbox 
              style={styles.checkbox}
              value={fieldVars[index]} 
              onValueChange={val => {
                let newFieldVars = fieldVars;fieldVars[index] = val;
                console.log("### set ##################");
                console.log(newFieldVars);
                setFieldVars(newFieldVars);
              }} 
            />
            :
            <TextInput 
              style={{ borderBottomColor: 'lightgray', borderBottomWidth: 1, minWidth:30}}
              editable
              defaultValue={fieldVars[index]}
              onChangeText={text => {
                let newFieldVars = fieldVars;fieldVars[index] = text;
                console.log("### set ##################");
                console.log(newFieldVars);
                setFieldVars(newFieldVars);
              }}
            />
          }
        </View>);
      })
    }
    <Button onPress={saveData} title="Save" />  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, 
  },
  item: {  
        padding: 10,  
        fontSize: 18,  
        height: 44,  
    },  
});
