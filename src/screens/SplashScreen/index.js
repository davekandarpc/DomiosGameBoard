
import React, { Component } from 'react';
import { Image, StatusBar, View } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { styles } from './styles';
import Orientation from 'react-native-orientation';



const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
});

export class SplashScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: false
        }
        global.myNavigation = this.props.navigation
        global.selectedGameType = ''
        global.gameName = ''
        global.GameId = ''
        global.admin = null
        global.UserId = null
    }

    componentDidMount = () => {
        Orientation.lockToPortrait()
        setTimeout(() => {
            StatusBar.setHidden(true);
            this.props.navigation.dispatch(resetAction);
        }, 4000)
    }


    render() {
        return (
            <View style={styles.main_container}>
                <Image source={require('../../assets/images/domino_gif.gif')} style={styles.logo} />
                {/* <Text style={styles.Logo_text_style}>Domino Circus</Text> */}
            </View >
        );
    }
}
export default SplashScreen;