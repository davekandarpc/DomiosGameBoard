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
    flex: 0.5
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
  gameTypeHorizontalView: {
    width: getWidth() - 100,
    alignSelf: 'center',
    margin: 16,
    height: getHeight() - getHeight()/4,
    backgroundColor: '#2d2425',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  gameTypeScrollView: {
    flexDirection: 'row',
    borderRadius: 8
  },
  gameTypeItem: {
    backgroundColor: '#f8e4c1',
    margin: 10,
    borderRadius: 12,
    width: 150,
    height: getHeight() - getHeight()/4 - 20,
    justifyContent: 'space-around'
  },
  dominoImgStyle: {
    width: 150,
    height: getHeight() - 2*getHeight()/4,
  },
  gameTypeLabel:{
    backgroundColor: '#a35830',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  gameTypeLabelText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  nextImageStyle: {
    height: 70,
    width: 70,
    alignSelf: 'center',
    zIndex: +1
  },
});
