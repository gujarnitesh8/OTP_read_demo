import React, { Component } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import SmsListener from 'react-native-android-sms-listener'

export default class App extends Component {
  state={
    otp:''
  }
  componentWillUnmount() {
    RNOtpVerify.removeListener();
  }
  componentDidMount() {
    this.requestReadSmsPermission();
    SmsListener.addListener(message => {
      let OTP = message.body.match(/\d+/g).map(Number);
      // alert(JSON.stringify(message.body));
      console.log(OTP);
      this.setState({ otp: OTP })
    });
  }

  async requestReadSmsPermission() {
    try {
      var granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "Auto Verification OTP",
          message: "need access to read sms, to verify OTP"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("sms read permissions granted", granted);
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, {
            title: "Receive SMS",
            message: "Need access to receive sms, to verify OTP"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("RECEIVE_SMS permissions granted", granted);
        } else {
          console.log("RECEIVE_SMS permissions denied");
        }
      } else {
        console.log("sms read permissions denied");
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>React native Android sms listner demo</Text>
        <Text>OTP is : {this.state.otp}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});


//Steps to Perform Automatically read SMS 

// 1. react-native-android-sms-listener install and link it
// 2. Give Permission in androidManifest.xml file as below
// <uses-permission android:name="android.permission.RECEIVE_SMS" />
// <uses-permission android:name="android.permission.READ_SMS" /> 
// 3. Do code as above done