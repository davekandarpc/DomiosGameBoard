import { StyleSheet, Dimensions } from 'react-native';
import {APICALL} from './ApiCaller';
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
export const apiEndpoint = 'http://67.205.132.124:4545/' // for live
// export const apiEndpoint = 'http://192.168.1.16:5000/' // for debug

export const getWidth = () => {
    if (WIDTH > HEIGHT) {
        return WIDTH
    } else {
        return HEIGHT
    }
};

export const getHeight = () => {
    if (WIDTH < HEIGHT) {
        return WIDTH
    } else {
        return HEIGHT
    }
};

export const updateState = async(UserId,action)=>{
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      users: UserId,
      action: action,
    });
    console.log("formData : "+JSON.stringify(formData))
    let apiData = {
      endpoint: 'userState',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    console.log("Update State : "+JSON.stringify(response))
    return response
}