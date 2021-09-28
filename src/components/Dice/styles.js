import { StyleSheet, Dimensions } from 'react-native';
import { getHeight, getWidth } from '../../common/functions'

export const styles = StyleSheet.create({
    dice: {
        height: 60,
        width: getWidth() / 20,
        backgroundColor: '#fff',
        alignContent: 'center',
        borderRadius: 4,
        paddingHorizontal: 3,
        borderWidth: 2,
    },
    upperDotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomWidth: 1.3,
        paddingVertical: 2,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    lowerDotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    dot: {
        backgroundColor: '#000',
        height: 6,
        width: 6,
        borderRadius: 6,
        margin: 1
    },
    bornYardDominoStyle: {
        transform: [{ rotate: '-45deg'}],
        fontSize: 7,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginTop: 22
    }
});
