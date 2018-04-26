import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  FlatList,
} from 'react-native';
import config from './config';
import * as firebase from 'firebase';


export default class RTDB extends Component {
    constructor() {
        super();
        this.PATH = "search";
        firebase.initializeApp(config);
        this.database = firebase.database();
        this.state = {
            items: [],
            type: 'user,message',
            index: 'firebase_user,firebase_message',
            term: '*b*',
            matchWholePhrase: false,
            size: 10,
            from: 0,
        };
    }

    buildQuery = () => {
        let query = {
            index: this.state.index,
            type: this.state.type,
            size: this.state.size,
            from: this.state.from,
            q: this.state.term,
        };

    // this.buildQueryBody(query, this.state.term, this.matchWholePhrase);
    return query;
  }

    buildQueryBody = (query, term, matchWholePhrase) => {
        if( matchWholePhrase ) {
            let body = query.body = {};
            body.query = {
                "match_phrase": {
                    "_all": term
                }
            }
        }
        else {
            query.q = term;
        }
    }

    doSearch = (query) => {
        let ref = this.database.ref().child(this.PATH);
        let key = ref.child('request').push(query).key;

        console.log('search', key, query);
        ref.child('response/'+key).on('value', this.showResults);
    }

    showResults = (snap) => {
        if(snap.val()==null){
            return;
        }
        const items = [];
        let dat = snap.val().hits.hits;
        console.log(dat)
        Object.keys(dat).forEach((key) => {
            console.log(dat[key]);
            items.push({
                key: dat[key]._id,
                source: JSON.stringify(dat[key]._source, null, 2),
            })
        })
        this.setState({
            items: items,
        });
        snap.ref.off('value', this.showResults);
        snap.ref.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.buttons}>
                <Button onPress={() => this.doSearch(this.buildQuery())} title='検索'/>
                </View>
                <FlatList
                data={this.state.items}
                renderItem={({item}) => <Text>{item.key}{item.source}</Text>}
                />
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
