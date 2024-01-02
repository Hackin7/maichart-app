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

function RandomCheckbox({ onChange }){
  let [checkbox, setCheckbox] = useState(true);
  return (
    <Checkbox style={{margin: 8, marginLeft: 'auto'}} 
      value={checkbox} 
      onValueChange={(value)=>{
        onChange(value);
        setCheckbox(value);
      }} 
    />
  );
}

function RandomCheckboxNeg({ onChange }){
  let [checkbox, setCheckbox] = useState(false)
  return (
    <Checkbox style={{margin: 8, marginLeft: 'auto'}} 
      value={checkbox} 
      onValueChange={(value)=>{
        onChange(value);
        setCheckbox(value);
      }} 
    />
  );
}
export default function DataEntry({navigation}){  
  //https://stackoverflow.com/questions/46504660/refresh-previous-screen-on-goback
  const isFocused = useIsFocused();
  useEffect(() => {
    isFocused && (()=>{
      setListData(listData); // Update on Refreshing page
    })()
  },[isFocused]);
  
  // Component State Management /////////////////////////////
  const [listData, setListData] = useState(format); 

  // Persistent Storage //////////////////////////////////////
  // Loading Data //////////////////////////////
  useEffect(()=>{
    Storage.getItem({ key: `staff`}).then((value)=>{
      console.log("### Loading Data ############");
      const staff = value;
      let data = format;
      try{
        data = JSON.parse(value);
        if (!Array.isArray(data)){return;}
        saveData(data);
        setListData(data);
      } catch (err){
        console.log("Initialise ###############");
        console.log(err);
        console.log(data);
        data = format;
      }
      console.log(data);
    });
  }, []);

  async function saveData(staff){
    await Storage.setItem({ key: `staff`, value: JSON.stringify(staff) })
  }

  // All Data Update //////////////////////////////////////
  const updateStaffPresence = (index, value) => {
    let staff = listData;
    staff[index].isPresent = value;
    setListData(staff);
    saveData(staff).then(()=>{
      //setListData(staff);
    });
  }

  //// Item Entry //////////////////////////////////////////////////////////////////
	function renderItem({ item, index, separators }) {
	  function goNext(){
          navigation.navigate("Instructor", 
          { 'item': item , "index":index, 
            'listData': listData,
            'setListData': setListData,
          });
	  }

    const isPresent = item.isPresent;
    console.log(item.name, isPresent);
    //https://stackoverflow.com/questions/32030050/how-can-you-float-right-in-react-native
    return (
      <View style={{borderBottomColor: 'lightgray', borderBottomWidth: 1, flexDirection: "row"}}>
        <TouchableOpacity onPress={goNext}>
          <Text style={styles.item}>{item.rank + " " + item.name}</Text>
        </TouchableOpacity>
        <Text style={{...styles.item , "color":"red"}}>{item.status ? "" + item.status : ""}</Text>
        {
          isPresent
          ?
          <RandomCheckbox 
          onChange={ (value) => {
            updateStaffPresence(index, value);
          }}/>
          :
          <RandomCheckboxNeg
          onChange={ (value) => {
            updateStaffPresence(index, value);
          }}/>
        }

        
      </View>
    );
  }

  //// Main View ////////////////////////////////////////////////////////
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", padding:10}}>
          <Button style={{marginLeft:"100"}} onPress={()=>{
             navigation.navigate("DataManagement", {setListData:setListData}) ;
          }} title="Data Management" />   
          <View style={{padding:10}}></View>
          <Button onPress={()=>{
            navigation.navigate("Instructor", {
              'item': {"rank":"LTA", "name":"Runner", "service":"Regular", "personType":"Permstaff", isPresent:true},
              'index':listData.length, 
              'listData':listData,
              'setListData': setListData,
            });
          }} style={{marginRight:50}} title="Add" />
      </View>
      <FlatList
        style={{ width: "100%" }}
        data={listData}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
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
