import * as React from 'react';
import { useState, useEffect } from "react";
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
//import { ProcessingData } from '../helpers/formHandler.js';
import Storage from 'expo-storage';


class ProcessingData {
  constructor(metadata) {
    // Given Data
    this.metadata = metadata;
    console.log("### Data Input");
    console.log(this.metadata);
  }
  // Data to Web Form Element ///////////////////////////////////
  getFormData(){
    let data = this.form_data;
    let output = {};
    for (let key in data){
      let elementId = web_form_id[key];
      output[elementId] = data[key];
    }
    return output;
  }

  getScript(){
    // https://stackoverflow.com/questions/53628112/fill-angular-input-using-javascript
    return `
      function run() {
        switch (window.location.href){
          case "https://maichart-kr.nuko.cat/":
            document.getElementsByClassName("input100").friend_code.value = "${this.metadata.friendCode}"; 
            //document.getElementsByClassName("wrap-input100")[1].childNodes[1].value = "rating_festival_plus_int";       
            break;
          case "https://maichart-kr.nuko.cat/request_friend.neko":
            // Open Sega ID
            ReactNativeWebView.postMessage("login");
          default:
            break;
        }
      }
      setTimeout(function(){
        try {run();}
        catch (err) {
          alert("App Error: "+err);
        }
      }, 1000);
    `;
  }

  process(){
    return this.getScript();
  }
}


export default function Form({navigation}) {
  const [autofillScript, setAutofillScript] = useState("");
  const [url, setURL] = useState("");
  Storage.getItem({ key: `metadata`}).then((value)=>{
    console.log("### Storage Start ##############")
    console.log("metadata", value);
    const metadata = value;
    setURL("https://maichart-kr.nuko.cat/"); //JSON.parse(metadata).url);
    Storage.getItem({ key: `staff`}).then((value)=>{
      const staff = value;
      console.log("staff", value);
      const manager = new ProcessingData(JSON.parse(metadata));
      setAutofillScript(manager.process());
      console.log(autofillScript);      
      console.log("### Storage Retrieved ##############")
    });
  })


  return (
    <WebView 
      style={styles.container}
      source={{uri: url}}  
      javaScriptEnabled={true}
      injectedJavaScript={autofillScript}    
      onMessage={(event) => {
        navigation.navigate("AcceptFriend");
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
