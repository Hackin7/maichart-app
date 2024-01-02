// Sample Data ////////////////////////////////////////////////////////
// Data Processing //////////////////////////////////////////////////////////

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
            document.getElementsByClassName("input100").friend_code.value = "8080284061100"; 
            document.getElementsByClassName("wrap-input100")[1].childNodes[1].value= "rating_festival_plus_int";       
            break;
          case "https://maichart-kr.nuko.cat/request_friend.neko":
            // Open Sega ID
            ReactNativeWebView.postMessage("Cookie: " + document.cookie);
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

export { ProcessingData };
