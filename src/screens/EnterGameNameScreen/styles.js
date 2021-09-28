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
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  textboxView: {
    backgroundColor: '#fee39e',
    width: '40%',
    alignSelf: 'center',
    borderRadius: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  gameNameTextBox: {
    paddingHorizontal: 12,
    borderRadius: 8,
    color: '#301b16',
    fontWeight: 'bold'
  }
});
