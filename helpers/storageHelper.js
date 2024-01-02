import { Storage } from 'expo-storage';
//import AsyncStorage from "@react-native-async-storage/async-storage";
//https://www.npmjs.com/package/expo-storage
//import SyncStorage from 'sync-storage';
//https://stackoverflow.com/questions/44376002/what-are-my-options-for-storing-data-when-using-react-native-ios-and-android

// Redux Code //////////////////////////////////////////////////////////
import * as Redux from 'redux';
import { Provider, connect } from 'react-redux';
const format = {
  staff:[
    {"rank":"LTA", "name":"Coen", "service":"Regular", isPresent:true},
    {"rank":"LTC", "name":"Adrian", "service": "Regular", isPresent:true},
    {"rank":"CPL", "name":"Daniel Goh Chin Hao", "service": "NSF", isPresent:true},
  ]
};
const reducer = (state=format, action) => {
    return action.value;
};
const createStore = function() {
  let store = Redux.createStore(reducer);
  store.dispatch(updateStore(format));
  return store;
}

const updateStore = function(value){
    return {type:"",value:value};
};
const updatePartStore = function(parts){
    var data = store;
    for(var key in parts){
        data[key] = parts[key];
    }
    return{type:"",value:data};
};

const mapStateToProps = (state, ownProps = {}) => {
   return {data:state};
};
const mapDispatchToProps = (dispatch) => {
    return {
        update:(parts)=>dispatch(updatePartStore(parts))
    }
}
const connectToStore = connect(mapStateToProps, mapDispatchToProps);

// Local Storage Code //////////////////////////////////////////////////

const setup = async () => {
}

const setAllStaff = async (id, data) => {
  await Storage.setItem({
    key: `staff`,
    value: JSON.stringify(data)
  });
};
const getAllStaff = async () => {
  return JSON.parse(
    await Storage.getItem({ key: `staff` })
  )
}

const updateStaff = async (id, newData) => {
  let data = await getAllStaff;
  data[id] = newData;
  await setAllStaff(id, newData);
}


const setMetadata = async (data) => {
  //await AsyncStorage.set(`metadata`,JSON.stringifydata);
  await Storage.setItem({ key: `metadata`, value: JSON.stringify(data) })
  console.log("save");
}

const getMetadata = (data) => {
  console.log(data);
  if (data == null){
    console.log("overwrite");
    data = JSON.stringify({
      "wing": "CWG", 
      "name": "PTE Blur", 
      "cadetsNSF": 0, 
      "cadetsReg": 0, 
      "cadetsIO": 0, 
      "mcCadets": 0, 
    });
    setMetadata(data);
  };
  //console.log(data);
  let metadata = JSON.parse(data);
  //console.log(metadata);
  return metadata;
}
  



export default {
  createStore, connectToStore, updateStore, 
  setup, setAllStaff, getAllStaff, updateStaff, setMetadata, getMetadata};