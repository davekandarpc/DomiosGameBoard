import { StyleSheet, Dimensions } from 'react-native';

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
    marginBottom: 10,
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
    alignItems: 'center'
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },
  friendItemDiseble: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    backgroundColor:'gray'
  },
  selectedIconStyle: {
    position: 'absolute',
    right: 10,
    color: '#fee39e'
  },
  userNameStyle: {
    color: '#f8f8f8',
    fontSize: 18,
    fontFamily:'Cardo-Regular'
  },
});