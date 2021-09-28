import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
import { Fonts } from '../../common/fonts';
export const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#FFFBFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 350,
        width: 350,
        resizeMode: 'contain'
    },
    Logo_text_style:{
        fontFamily:Fonts.Righteous_Regular,
        color:'#000',
        fontSize:25
    }
})