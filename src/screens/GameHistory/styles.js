import { StyleSheet, Dimensions } from 'react-native';
import {getHeight, getWidth} from '../../common/functions'
export const styles = StyleSheet.create({
  main_view_container: {
    flex: 1,
  },
  screenBackgroundStyle: {
    flex: 1
  },
  selectGameTypeLablel: {
    backgroundColor: '#fee39e',
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignSelf: 'center',
    borderRadius: 2,
  },
  backImageStyle: {
    height: 30,
    width: 70,
    margin: 10,
  },
  backButtonStyle: {
    height: 30,
    width: 70,
  },
  selectGameTypeLabelText: {
    color: '#301b16',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 10
  },
  friendsListView: {
    backgroundColor: '#2d2425',
    width: '50%',
    padding: 16,
    alignSelf: 'center',
  },
  findUserNameBackgroundStyle: {
    height: 50,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'center',
    marginTop: 1
  },
  selectedIconStyle: {
    position: 'absolute',
    right: 10,
    color: '#fee39e'
  },
  userNameStyle: {
    color: '#fff',
    fontSize: 18
  },
  logo: {
    height: '60%',
    resizeMode: 'contain',
  },

  container: {
    backgroundColor: "#FFF",

  },
  gameTypeItem: {
    // backgroundColor: 'rgba(248,228,193,0.8)',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 2,
    width: 180,
    // height: getHeight() - getHeight()/4 - 20,
    justifyContent: 'space-around',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  dominoImgStyle: {
    width: 150,
    height: 50,
    alignSelf: 'center'
  },
  gameNameView:{
    // backgroundColor: '#86543b',
    // alignItems: 'center',
    // paddingVertical: 5,
    marginHorizontal: 10
  },
  gameTypeLabelText: {
    color: '#b16600',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 16,
    marginHorizontal: 10
  },
  playButtonStyle: {
    height: 70,
    width: 120,
    alignSelf: 'center'
  },
  playButtonImageStyle: {
    height: 70,
  },
  gameMemberText: {
    fontSize: 14,
    justifyContent:'center',
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#734325',
    backgroundColor: 'rgba(248,228,193,0.8)',
    paddingHorizontal: 5,
    fontWeight: 'bold'
  },
  gameHostText: {
    fontSize: 14,
    color: '#fff'
  }
});