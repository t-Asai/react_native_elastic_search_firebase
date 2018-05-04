import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  FlatList,
  TextInput,
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
            term: '*',
            matchWholePhrase: false,
            size: 10,
            from: 0,
        };
    }

    buildQuery = () => {
        let query = {
            index: this.state.index,
            type: this.state.type,
            size: !this.state.size ? 10 : this.state.size,
            from: !this.state.from ? 0 : this.state.from,
            q: !this.state.term ? '*' : this.state.term,
        };
        return query;
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
        if(snap.val().hits.total > 0){
            let dat = snap.val().hits.hits;
            Object.keys(dat).forEach((key) => {
                items.push({
                    key: dat[key]._id,
                    source: JSON.stringify(dat[key]._source, null, 2),
                    JSON_ALL: JSON.stringify(dat[key], null, 2),
                })
            })
        }else{
            items.push({
                key: '',
                source: 'no data',
            })
        }
        this.setState({
            items: items,
        });
        snap.ref.off('value', this.showResults);
        // snap.ref.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.actions}>
                <TextInput
                    placeholder={this.state.term}
                    onChangeText={(text) => this.setState({term: text})}
                />
                <TextInput
                    placeholder={this.state.size.toString()}
                    onChangeText={(integer) => this.setState({size: integer})}
                />
                <TextInput
                    placeholder={this.state.from.toString()}
                    onChangeText={(integer) => this.setState({from: integer})}
                />
                <Button onPress={() => this.doSearch(this.buildQuery())} title='検索'/>
                </View>
                <FlatList
                data={this.state.items}
                renderItem={({item}) => <Text>{item.source}</Text>}
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
    actions: {
        marginTop:20,
        backgroundColor: '#F5FCFF',
    },
});
