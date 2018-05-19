import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import FS from './FS'

export default class App extends Component {

  render() {
    return (
      <View style={styles.container}>
        <FS/>
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
