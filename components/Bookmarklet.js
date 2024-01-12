import * as React from 'react';
import { useState, useEffect, useRef } from "react";
import { WebView } from 'react-native-webview';
import { StyleSheet, BackHandler } from 'react-native';
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
        javascript:(function(d){if(["https://maimaidx.jp","https://maimaidx-eng.com"].indexOf(d.location.origin)>=0){var s=d.createElement("script");s.src="https://myjian.github.io/mai-tools/scripts/all-in-one.js?t="+Math.floor(Date.now()/60000);d.body.append(s);}})(document);
        window.removeEventListener('message', window.ratingCalcMsgListener);
        ReactNativeWebView.postMessage("newPage");
      }
      setTimeout(function(){
        try {run();}
        catch (err) {
          alert("App Error: "+err);
        }
      }, ${this.metadata.timeout ? this.metadata.timeout : 500});
    `;
  }

  process(){
    return this.getScript();
  }
}


export default function Bookmarklet({navigation}) {
  const webViewRef = useRef();
  const [autofillScript, setAutofillScript] = useState("");
  const [url, setURL] = useState("");
  const [depth, setDepth] = useState(0);

  // https://stackoverflow.com/questions/65882469/react-native-webview-make-back-button-on-android-go-back - another potential method
  // https://reactnavigation.org/docs/preventing-going-back/
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        console.log("### DEPTH ###########################");
        console.log(depth);
        
        if (depth <= 1) {
          return;
        }

        e.preventDefault(); // Prevent default behavior of leaving the screen
        try {
          setDepth(depth - 1);
          console.log("### DEPTH REMOVAL ###########################");
          console.log(depth-1);  // a bit buggy but will fix soon
          webViewRef.current?.goBack();
        } catch (err) {
            console.log("[handleBackButtonPress] Error : ", err.message)
        }
      }),
    [navigation, depth]
  );

  Storage.getItem({ key: `metadata`}).then((value)=>{
    console.log("### Storage Start ##############")
    console.log("metadata", value);
    const metadata = value;
    setURL("https://maimaidx-eng.com/"); //JSON.parse(metadata).url);
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
      ref={webViewRef}
      style={styles.container}
      source={{uri: url}}  
      javaScriptEnabled={true}
      injectedJavaScript={autofillScript}    
      onMessage={(event) => {
        console.log("### DEPTH ###########################");
        console.log(depth + 1);
        setDepth(depth + 1);
      }}
      setSupportMultipleWindows={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
