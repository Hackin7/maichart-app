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

import Storage from 'expo-storage';


let statuses = [
    "",
    "Duty", 
    "Day Off",
    "Leave(Local/Overseas)",
    "Reporting Sick",
    "Medical Leave",
    "Medical/Dental Appointment",
    "Hospitalised/Sick Bay",
    "Child Sick Leave",
    "Course/Seminar/Briefing",
    "Field Exercise",
    "Overseas Exercise",
    "AWOL",
    "Close Arrest",
    "Detention",
    "Civil Custody",
    "Attached Out",
    "Others"
]
const fields = [
  {"name":"Rank", "key":"rank"},
  {"name":"Name", "key":"name"},
  {"name":"Service Type", "key":"service", "options":["Regular", "NSF"]},
  {"name":"Status (if any)", "key":"status", "options": statuses},
];
import { Dropdown } from 'react-native-element-dropdown'

export default function Instructor({navigation, route}){
  let instr = route.params.item;
  let index = route.params.index;
  let listData = route.params.listData;
  let setListData = route.params.setListData;

  let fieldVars = [];
  for (let field in fields){
    fieldVars.push(useState(instr[fields[field].key]));
  }

  // Redux //////////////////////////////////////////////
  const updateStaff = (index, instr) => {
    let staff = listData;
    staff[index] = instr;
    setListData(staff);
    saveData(staff);
  }
  const removeStaff = (index) => {
    let staff = listData;
    staff.splice(index, 1);
    setListData(staff);
    saveData(staff);
  }
  // Saving ///////////////////////////////////////////////////////
  async function saveData(staff){
    await Storage.setItem({ key: `staff`, value: JSON.stringify(staff) });
  }

  // UI Components //////////////////////////////////////////////////
  useEffect(() => {
		navigation.setOptions({
			headerRight: () => <Button onPress={()=>{
        removeStaff(route.params.index);
        navigation.goBack();
      }} title="Remove" />,
		});
  });

  return (
    <View style={styles.container}>
    {
      fields.map((item, index) => {
        return <View style={[styles.item, { flexDirection: "row" }]}>
          <Text>{item.name}: </Text>
          {
            item.options ? 
            <Dropdown
                data={item.options.map((item) => {return {"label":item, "value":item}})}
                labelField="label"
                valueField="value"
                value={fieldVars[index][0]}
                style={{minWidth:160}}
                onChange={item => {
                  let v = undefined;
                  if (item.value !== ""){
                    v = item.value;
                  }
                  fieldVars[index][1](v);
                }}
            />
            :
            <TextInput 
            style={{borderBottomColor: 'lightgray', borderBottomWidth: 1, minWidth:30}} 
            editable
            defaultValue={fieldVars[index][0]}
            onChangeText={text => fieldVars[index][1](text)}
          />
          }
        </View>;
      })
    }
    
    <Button onPress={()=>{
      instr.rank = fieldVars[0][0];
      instr.name = fieldVars[1][0];
      instr.service = fieldVars[2][0];
      instr.status = fieldVars[3][0];
      updateStaff(route.params.index, instr);
      navigation.goBack();
    }} title="Save" />  
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
