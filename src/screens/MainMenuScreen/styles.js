import { StyleSheet, Dimensions } from 'react-native';
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
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
    fontSize: 18,
    fontFamily:'Cardo-Regular',
  },
  logo: {
    height: '60%',
    resizeMode: 'contain',
  },

  container: {
    backgroundColor: "#FFF",

  },
  player: {
    position: "absolute",
    backgroundColor: "pink",
    width: 100,
    height: 100,
  },
  player1: {
    position: "absolute",
    backgroundColor: "red",
    width: 100,
    height: 100,
  },
  // model
  centeredView: {
    flex: 1,
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width:width/1.8,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal:10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});