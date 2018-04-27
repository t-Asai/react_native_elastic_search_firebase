import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
// import ES from './CP'
// import ES from './RTDB'
import ES from './FS'

export default class App extends Component {

  render() {
    return (
      <View style={styles.container}>
        <ES/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
