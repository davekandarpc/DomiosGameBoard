import Snackbar from 'react-native-snackbar';
export function showToast(toastText="", toastType="success") {
    return Snackbar.show({
        text: toastText, duration: Snackbar.LENGTH_SHORT,
        action: {
            text: toastType === 'error' ? 'Error!' : 'Ok',
            textColor: toastType === 'error' ? 'red' : (toastType === 'warning' ? '#ffcc00' : 'green')
        }
    });
}