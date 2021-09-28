import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {Images} from '../../common/Images';
import {styles} from './styles';
import Orientation from 'react-native-orientation';
import {APICALL} from '../../common/ApiCaller';

export class GameHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gamehistorydata: [],
      invitedGames: [
        {
          gameName: 'Office Group',
          host: 'Kandarp Dave',
          memners: [
            {name: 'Kandarp Dave', id: 1},
            {name: 'Mahammad Momin', id: 1},
            {name: 'Yash Khandar', id: 1},
            {name: 'Dev Suthar', id: 1},
          ],
        },
        {
          gameName: 'GadgetApp',
          host: 'Dhaval Shah',
          memners: [
            {name: 'Mahammad Momin', id: 1},
            {name: 'Kandarp Dave', id: 1},
            {name: 'Yash Khandar', id: 1},
            {name: 'Dev Suthar', id: 1},
          ],
        },
        {
          gameName: 'Default',
          host: 'Dhaval Shah',
          memners: [
            {name: 'Mahammad Momin', id: 1},
            {name: 'Kandarp Dave', id: 1},
            {name: 'Yash Khandar', id: 1},
            {name: 'Dev Suthar', id: 1},
          ],
        },
        {
          gameName: 'GadgetApp',
          host: 'Dhaval Shah',
          memners: [
            {name: 'Mahammad Momin', id: 1},
            {name: 'Kandarp Dave', id: 1},
            {name: 'Yash Khandar', id: 1},
            {name: 'Dev Suthar', id: 1},
          ],
        },
        {
          gameName: 'Default',
          host: 'Dhaval Shah',
          memners: [
            {name: 'Mahammad Momin', id: 1},
            {name: 'Kandarp Dave', id: 1},
            {name: 'Yash Khandar', id: 1},
            {name: 'Dev Suthar', id: 1},
          ],
        },
      ],
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    this.getHistory();
  }

  getHistory = async () => {
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      user: global.UserId,
    });
    let apiData = {
      endpoint: 'getgamehistory',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    // console.log('Response History  :' + JSON.stringify(response));
    if (response.status == 200) {
      var data = response.history
      for(var i=0;data.length > i;i++){
        var maxValue = Math.max.apply(null,
          data[i].map(function(o) {
            return o.Game_Points;
          }));
          console.log("MAX : "+JSON.stringify(maxValue))
        // if(data)
        // console.log("Daat : "+JSON.stringify(data[i]))
        for(var j=0;data[i].length > j;j++){
          // if(global.UserId == data[i][j].UserId){
            if(j == 0 && data[i][1] != undefined){
              // console.log("POnts : "+data[i][0].Game_Points)
              // console.log("POnts : "+data[i][1].Game_Points)
              if(data[i][0].Game_Points == data[i][1].Game_Points){
                data[i][j].tie = true
                break
              }
            }
              if(data[i][j].Game_Points == maxValue){
                console.log("WINNN JJ: "+JSON.stringify(data[i][j].UserId))
                console.log("WINNN Game ID : "+JSON.stringify(data[i][j].Id))
              data[i][j].win = data[i][j].UserId
            }
          // console.log("Daataaa : "+JSON.stringify(data[j]))

        }
        // }
      }
      this.setState({gamehistorydata: data});
    }
  };

  _onNewGame = () => {
    this.props.navigation.navigate('EnterGameNameScreen');
  };

  _goToInvitedGamesList = () => {
    this.props.navigation.navigate('InvitedGamesList');
  };

  renderSeparator = () => {
    return <View style={{height: 1, margin: 5}} />;
  };

  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key);
  };

  renderItem = (item, index) => {
    console.log("ITEM : "+JSON.stringify(item))
    return (
      index % 1 == 0 && (
        <TouchableOpacity style={styles.gameTypeItem}>
          <Image
            source={Images.dominoDice}
            style={styles.dominoImgStyle}
            resizeMode={'contain'}
          />
          <Text style={styles.gameTypeLabelText}>{item[0].GameName}</Text>
            <View>
              {item[0].tie !=true ?
              item[0].UserId == global.UserId ?
                <Text style={styles.gameTypeLabelText}>{ item[0].win == global.UserId ? 'Win' : 'Lose'}</Text>
                :
                <Text style={styles.gameTypeLabelText}>{ item[1].win == global.UserId ? 'Win' : 'Lose'}</Text>
                :
                <Text style={styles.gameTypeLabelText}>Tie</Text>
              }
            </View>
            {/* <Text style={styles.gameTypeLabelText}>{item[1].UserId!= undefined && item[1].UserId == global.UserId && 'Win'}</Text> */}
          <View>
            {
              item.map((itm,idx)=>{
                // var win = itm.filter
                return(
                  <View style={styles.gameMemberText}>
                    {/* <View style={[{flexDirection: 'row'}]}> */}
                    {/* <Text>Winner </Text> */}
                    {/* <Text>{item[idx].Game_Points>item[idx+1].Game_Points ? 'Winner':'Lose'} </Text> */}
                      {/* </View> */}
                    <Text>User Name </Text>
                    <View style={[{flexDirection: 'row'}]}>
                      <Text>{itm.FirstName}</Text>
                      <Text>{itm.LastName}</Text>
                    </View>
                    <Text>Points </Text>
                      <Text>{itm.Game_Points}</Text>
                  {/* <Text>{itm.UserId}</Text> */}
                  </View>
                )
              })
            }
            </View>
          {/* <View style={styles.gameNameView}> */}
          {/* <Text style={styles.gameHostText}>Hosted By: </Text>
          <Text style={styles.gameHostText}>{item.host}</Text>
        </View> */}
          {/* <View>
        </View> */}
          {/* <View style={styles.gameMemberText}>
            <Text>User Name </Text>
            <Text>{this.state.gamehistorydata[index].UserId} </Text>
            <View style={[{flexDirection: 'row'}]}>
              <Text>{this.state.gamehistorydata[index].FirstName}</Text>
              <Text>{this.state.gamehistorydata[index].LastName}</Text>
            </View>
          </View>
          <View style={[styles.gameNameView, {flexDirection: 'row'}]}>
            <Text style={styles.gameHostText}>Points: </Text>
            <Text style={styles.gameHostText}>{this.state.gamehistorydata[index].Game_Points}</Text>
          </View> */}
          {/* <View style={styles.gameMemberText}>
            <Text>User Name </Text>
            <Text>{this.state.gamehistorydata[index].UserId} </Text>
            <View style={[{flexDirection: 'row'}]}>
              <Text>{this.state.gamehistorydata[index+1].FirstName}</Text>
              <Text>{this.state.gamehistorydata[index+1].LastName}</Text>
            </View>
          </View>
          <View style={[styles.gameNameView, {flexDirection: 'row'}]}>
            <Text style={styles.gameHostText}>Points: </Text>
            <Text style={styles.gameHostText}>{this.state.gamehistorydata[index+1].Game_Points}</Text>
          </View> */}
          {/* {
          item.memners.map((member, index)=> {
            return(
              <Text style={styles.gameMemberText}>{member.name}</Text>
            )
          })
        } */}
        </TouchableOpacity>
      )
    );
  };

  render() {
    const {invitedGames, gamehistorydata} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground
          source={Images.woodenBackground}
          style={styles.screenBackgroundStyle}>
          {/* <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}> */}
          <FlatList
            data={gamehistorydata}
            renderItem={({item, index}) => this.renderItem(item, index)}
            ItemSeparatorComponent={this.renderSeparator}
            horizontal
            style={{margin: 50, alignSelf: 'center'}}
          />
          {/* </ScrollView> */}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default GameHistory;
