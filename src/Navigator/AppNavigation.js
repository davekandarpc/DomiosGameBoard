import * as React from 'react';
import { Animated } from 'react-native';
import { Transition } from 'react-native-reanimated';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionSpecs, HeaderStyleInterpolators } from 'react-navigation-stack';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgetPassWordScreen from '../screens/ForgetPassWordScreen';
import ResetPwdScreen from '../screens/ResetPwdScreen';
import SelectGameTypeScreen from '../screens/SelectGameTypeScreen'
import ChooseNumberOfOponentScreen from '../screens/ChooseNumberOfOponentScreen'
import EnterGameNameScreen from '../screens/EnterGameNameScreen'
import FindUsersScreen from '../screens/FindUsersScreen'
import StartGameScreen from '../screens/StartGameScreen'
import MainMenuScreen from '../screens/MainMenuScreen'
import StarightDominoType from '../screens/GameBoard/StarightDominoType';
import BlockType from '../screens/GameBoard/BlockType';
import DrawType from '../screens/GameBoard/DrawType';
import AllFive from '../screens/GameBoard/AllFive';
import MexicanTrain from '../screens/GameBoard/MexicanTrain';
import JamaicanStyle from '../screens/GameBoard/JamaicanStyle';
import InvitedGamesList from '../screens/InvitedGamesList';
import GameHistory from '../screens/GameHistory';
import PlayerNumberSelection from '../screens/PlayerNumberSelection';

const MainStack = createStackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: {
        headerShown: false,
        //...MyTransition
      },
    },
    MainMenuScreen: {
      screen: MainMenuScreen,
      navigationOptions: {
        headerShown: false,
        //...MyTransition
      },
    },
    InvitedGamesList: {
      screen: InvitedGamesList,
      navigationOptions: {
        headerShown: false
      }
    },
    GameHistory: {
      screen: GameHistory,
      navigationOptions: {
        headerShown: false
      }
    },
    PlayerNumberSelection: {
      screen: PlayerNumberSelection,
      navigationOptions: {
        headerShown: false
      }
    },
    StarightDominoType: {
      screen: StarightDominoType,
      navigationOptions: {
        headerShown: false
      }
    },
    BlockType: {
      screen: BlockType,
      navigationOptions: {
        headerShown: false
      }
    },
    DrawType: {
      screen: DrawType,
      navigationOptions: {
        headerShown: false
      }
    },
    AllFive: {
      screen: AllFive,
      navigationOptions: {
        headerShown: false
      }
    },
    MexicanTrain: {
      screen: MexicanTrain,
      navigationOptions: {
        headerShown: false
      }
    },
    JamaicanStyle: {
      screen: JamaicanStyle,
      navigationOptions: {
        headerShown: false
      }
    },
    // SplashScreen: {
    //   screen: SplashScreen,
    //   navigationOptions: {
    //     headerShown: false,
    //     //...MyTransition
    //   },
    // },
    EnterGameNameScreen: {
      screen: EnterGameNameScreen,
      navigationOptions: {
        headerShown: false,
        //...MyTransition
      },
    },
    SelectGameTypeScreen: {
      screen: SelectGameTypeScreen,
      navigationOptions: {
        headerShown: false,
        //...MyTransition
      },
    },
    ChooseNumberOfOponentScreen: {
      screen: ChooseNumberOfOponentScreen,
      navigationOptions: {
        headerShown: false,
        //...MyTransition
      },
    },
    StartGameScreen: {
      screen: StartGameScreen,
      navigationOptions: {
        headerShown: false,
        //...MyTransition
      },
    },
    FindUsersScreen: {
      screen: FindUsersScreen,
      navigationOptions: {
        headerShown: false,
        //...MyTransition
      },
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
        tabBarVisible: false,
        //...MyTransition
      },
    },
    SignUpScreen: {
      screen: SignUpScreen,
      navigationOptions: {
        headerShown: false,
        tabBarVisible: false,
        //...MyTransition
      },
    },
    ForgetPassWordScreen: {
      screen: ForgetPassWordScreen,
      navigationOptions: {
        headerShown: false,
        tabBarVisible: false,
        //...MyTransition
      },
    },
    ResetPwdScreen: {
      screen: ResetPwdScreen,
      navigationOptions: {
        headerShown: false,
        tabBarVisible: false,
        //...MyTransition
      },
    },
  },
  {

    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-right"
          durationMs={400}
          interpolation="easeIn"
        />
        <Transition.In type="slide-left" durationMs={0} />
      </Transition.Together>
    ),
  }
);

const AppContainer = createAppContainer(MainStack);
export default AppContainer;
