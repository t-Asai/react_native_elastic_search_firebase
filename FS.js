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
import firebase from 'react-native-firebase';


export default class FS extends Component {
    constructor(props) {
        super(props);
        this.ref_req = firebase.firestore().collection('search_request');
        this.ref_res = firebase.firestore().collection('search_response');
        this.unsubscribe = null;
        this.state = {
            items: [],
            type: 'user',
            index: 'firebase_user',
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

    doSearch = async (query) => {
        const snap = await this.ref_req.add(query);
        const key = snap.id;
        this.unsubscribe = this.ref_res.doc(key).onSnapshot(this.showResults);
    }

    showResults = (snap) => {
        if (snap.data() == undefined ){
            return;
        }else{
            this.setState({
                items: [{
                    key: 0,
                    source: snap.data(),
                }],
            })
            snap.ref.delete()
            this.unsubscribe = null;
        }
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
                    renderItem={({item}) => <Text>{JSON.stringify(item.source,undefined,1)}</Text>}
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
