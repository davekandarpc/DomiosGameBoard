import { StyleSheet, Dimensions } from 'react-native';
import { getHeight, getWidth } from '../../../common/functions'

export const styles = StyleSheet.create({
  screenBackgroundStyle: {
    flex: 1
  },
  centerlogoview: {
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    height: "100%",
    width: "100%",
    justifyContent:'center',
    alignItems:'center'
  },
  centerlogo: {
    height:'45%',
    width:'45%',
    backgroundColor: 'transparent'
  },
  gameBoard: {
    flex: 1,
    backgroundColor: '#03302d',
    marginHorizontal: 50,
    borderWidth: 20,
    borderRadius: 48,
    borderColor: '#202828',
    justifyContent: 'center',
    alignItems: 'center'
  },
  oponentPlayerPanel: {
    width: '22%',
    backgroundColor: '#4f2816',
    alignSelf: 'center',
    borderRadius: 16,
    // position: 'absolute',
    // top: 0,
    zIndex: +1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 7,
    alignItems: 'center',
    borderColor: '#936811',
  },
  oponentPlayerPanel_active: {
    width: '20%',
    backgroundColor: '#4f2816',
    alignSelf: 'center',
    borderRadius: 16,
    // position: 'absolute',
    // top: 0,
    zIndex: +1,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#1f7b5d',
    padding: 7,
    alignItems: 'center'
  },
  mainTrainPanelView: {
    width: '100%',
    height:'100%',
    position: 'absolute',
    top: 100,
    left:0,
    zIndex: +1,
  },
  maintrainview:{
    width:getWidth(),
    height:'13%',
    flexDirection:'row'
  },
  usertrainview:{
    width:getWidth(),
    // borderWidth:1,
    // minHeight:'40%',
    // height:'35%',
    height:getHeight()/8,
    flexDirection:'row'
  },
  mainTrainPanel: {
    backgroundColor: '#4f2816',
    alignSelf: 'flex-start',
    borderRadius: 16,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#936811',
    marginVertical:5,
    width:150,
    // height:90,
    borderWidth:1,
  },
  maintraindominoview:{
    width:'74%',
    flexDirection:'row'
  },
  selfPanel: {
    backgroundColor: '#4f2816',
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 16,
    position: 'absolute',
    bottom: 5,
    zIndex: +1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#936811',
    padding: 7,
    alignItems: 'center'
  },
  selfPanel_active: {
    backgroundColor: '#4f2816',
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 16,
    position: 'absolute',
    bottom: 5,
    zIndex: +1,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#1f7b5d',
    padding: 7,
    alignItems: 'center'
  },
  playerNameView: {
    backgroundColor: '#151821',
    height: '100%'
  },
  playerNameText: {
    color: '#d09320',
    fontSize: 16,
    fontFamily:'Cardo-Bold'
  },
  dice: {
    height: 50,
    width: getWidth() / 20,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  bornYardStyle: {
    backgroundColor: '#4f2816',
    position: 'absolute',
    top: '42%',
    right: 0,
    zIndex: +1,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopColor: '#936811',
    borderBottomColor: '#936811',
    borderLeftColor: '#936811',
    borderTopWidth:4,
    borderLeftWidth:4,
    borderBottomWidth:4,
    paddingLeft: 10,
    paddingRight: 3,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bornYardDisebleStyle: {
    backgroundColor: 'gray',
    position: 'absolute',
    top: '42%',
    right: 0,
    zIndex: +1,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopColor: 'gray',
    borderBottomColor: 'gray',
    borderLeftColor: 'gray',
    borderTopWidth:4,
    borderLeftWidth:4,
    borderBottomWidth:4,
    paddingLeft: 10,
    paddingRight: 3,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  SkipButtonStyle: {
    backgroundColor: '#894f25',
    position: 'absolute',
    right: 10,
    bottom:10,
    zIndex: +1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10
  },
  SkipButtonDisebleStyle: {
    backgroundColor: 'gray',
    position: 'absolute',
    right: 10,
    bottom: 10,
    zIndex: +1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  SkipButtonTextStyle: {
    color: '#fff',
    fontFamily:'Cardo-Bold',
    fontSize: 14,
    marginVertical:10,
    marginHorizontal:25,
    elevation:8
  },
  bornYardText: {
    color: '#d09320',
    fontFamily:'Cardo-Bold',
    fontSize: 14
  },
  bornYardDicesText: {
    color: '#1f7b5d',
    fontWeight: 'bold',
    fontSize: 22
  },
  playerPanelValuesRow: {
    flexDirection: 'row'
  },
  playerPanelLabel: {
    color: '#d09320',
    fontSize: 16,
    fontFamily:'Cardo-Regular',
    flex: 1
  },
  playerPanelValue: {
    color: '#1f7b5d',
    fontWeight: 'bold',
    fontSize: 16
  },
  selfPanelLabel: {
    color: '#d09320',
    fontSize: 14,
    fontFamily:'Cardo-Regular',
    flex: 1
  },
  selfPanelValue: {
    color: '#1f7b5d',
    fontWeight: '200',
    fontSize: 16,
    marginLeft: 10
  },

  //Bornyard css
  bornYardBoardStyle: {
    padding:10,
    width: getWidth() - 200,
    height: getHeight() / 2,
    borderRadius: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    position: 'absolute',
    left:90
  },
  bornYardBGImageStyle: {
    borderRadius: 12,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    marginTop: 20,
    backgroundColor: "#28302d",
    borderRadius: 20,
    width:getWidth()/1.8,
    paddingVertical: 0,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color:'#d09320',
    fontSize:30
  },
  imageBackground:{
    height:'99%',
    width:'100%',
    borderRadius: 20,
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
    elevation: 2,
    marginHorizontal:10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});
