/*
* this file is no more than copy and paste
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
} from 'react-native';
import config from './config';
import * as firebase from 'firebase';


export default class CP extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
        <Button onPress={() => doSearch(buildQuery())} title='検索'/>
        <Button onPress={() => this.setState({ })} title='更新'/>
        </View>
        <ScrollView>
          <Text>
          text: {value}
          </Text>
        </ScrollView>
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
  buttons: {
    marginTop:20,
    backgroundColor: '#F5FCFF',
  },
});


var PATH = "search";
firebase.initializeApp(config);
var database = firebase.database();
let value;

function buildQuery() {
  // this just gets data out of the form
  var type = 'user,message';  // $form.find('[name="type"]:checked').val();
  var index = 'firebase_user,firebase_message';  // $form.find('[name=index]').val() + '_' + type;
  var term = '*b*';
  var matchWholePhrase = false;
  var size = 10;
  var from = 0;

  // skeleton of the JSON object we will write to DB
  var query = {
    index: index,
    type: type
  };

  // size and from are used for pagination
  if( !isNaN(size) ) { query.size = size; }
  if( !isNaN(from) ) { query.from = from; }

  buildQueryBody(query, term, matchWholePhrase);
  return query;
}

function buildQueryBody(query, term, matchWholePhrase) {
  if( matchWholePhrase ) {
    var body = query.body = {};
    body.query = {
      // match_phrase matches the phrase exactly instead of breaking it
      // into individual words
      "match_phrase": {
        // this is the field name, _all is a meta indicating any field
        "_all": term
      }
      /**
       * Match breaks up individual words and matches any
       * This is the equivalent of the `q` string below
      "match": {
        "_all": term
      }
      */
    }
  }
  else {
    query.q = term;
  }
}

function doSearch(query) {
  var ref = database.ref().child(PATH);
  var key = ref.child('request').push(query).key;

  console.log('search', key, query);
  ref.child('response/'+key).on('value', showResults);
}

// when results are written to the database, read them and display
function showResults(snap) {
  if( !snap.exists() ) { return; } // wait until we get data
  var dat = snap.val().hits;

  // when a value arrives from the database, stop listening
  // and remove the temporary data from the database
  snap.ref.off('value', showResults);
  snap.ref.remove();

  // the rest of this just displays data in our demo and probably
  // isn't very interesting
  var totalText = dat.total;
  if( dat.hits && dat.hits.length !== dat.total ) {
    totalText = dat.hits.length + ' of ' + dat.total;
  }
  console.log('dat->');
  console.log(JSON.stringify(dat, null, 2));
  console.log('<-dat');
  value = JSON.stringify(dat, null, 2)
}