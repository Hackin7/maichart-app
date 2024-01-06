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
      let translation = {
        "입력한 친구 코드로 친구를 요청했어요!": "You have requested a friend using the friend code you entered!",
        "친구 요청을 수락한 후": "After accepting the friend request",
        "아래 버튼을 눌러주세요": "Please click the button below",
        "차트를 선택해 주세요.": "Please select a chart.",
        "올바른 친구 코드를 입력해 주세요.": "Please enter the correct friend code",
        "차트 선택": "Select Chart",
        "레이팅표": "Rating Table",
        "상수표": "Table of Charts",
        "[처음으로 돌아가기]": "[Back to Beginning]",
        "[차트 다운로드]": "[Download chart]",
        "차트 갱신": "Chart Update"
      };
      function translate() {
        for (let korean in translation) {
          document.body.innerHTML = document.body.innerHTML.replaceAll(korean, translation[korean]);
        }
      }
      function run() {
        switch (window.location.href){
          case "https://maichart-kr.nuko.cat/":
            //translate(); // not working somehow - ruining captcha
            document.getElementsByClassName("input100").friend_code.value = "${this.metadata.friendCode}"; 
            //document.getElementsByClassName("wrap-input100")[1].childNodes[1].value = "rating_festival_plus_int";       
            break;
          case "https://maichart-kr.nuko.cat/request_friend.neko":
            // Open Sega ID
            document.body.innerHTML = document.body.innerHTML.replaceAll("p-t-50", "");
            document.body.innerHTML = document.body.innerHTML.replace(
              "친구 요청을 수락한 후", 
              "The app will automatically accept <br/>ＣＡＴ．ＢＯＴ♪ friend request.<br/> After that,"
            );
            translate();
            ReactNativeWebView.postMessage("login");
          default:
            translate();
            break;
        }
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
