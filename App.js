/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   Platform,
   StyleSheet,
   Text,
   View,
   Image,
   ScrollView,
   FlatList,
   Picker,
   TouchableHighlight,
   Alert,
   TextInput,
   Dimensions,
 } from 'react-native';

import Icon from 'react-native-ionicons';
import { createBottomTabNavigator } from 'react-navigation';

//Hotfix for isMounted() warning
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

//Options
const itemWidth = 130;


var {height, width} = Dimensions.get('window');
var numColumns = (parseInt(width/itemWidth) <= 1) ? 2 : parseInt(width/itemWidth, 10);
type Props = {};

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

class SearchScreen extends React.Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Welche Serie möchtest du anschauen?"
          placeholderTextColor="white"
          onChangeText={(text) => this.setState({text})}
        />
      </View>
    );
  }
}

class ListSeries extends React.Component {
  onPress(arg) {
    Alert.alert('Serien ID:'+arg);
  }
  constructor(props){
    super(props);
    this.state ={ isLoading: true, serieType: "Movie"};
    this.onPress = this.onPress.bind(this);
  }

  loadSeries(serieType){
    this.setState({
      isLoading: true,
    });
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        this.setState({
          isLoading: false,
          dataSource: JSON.parse(request.responseText),
        });
      } else {
        //Load error page maybe
        Alert.alert("Fehler beim Lesen der Serien");
      }
    };

    request.open('GET', 'http://92.222.68.94/api/list/'+serieType);
    request.send();
  }

  componentDidMount(){
    this.loadSeries(this.state.serieType);
  }

  formatData(data,numColumns) {
    return data;
  };

renderItem = ({item, index}) => {
  return(
    <TouchableHighlight style={styles.serieButton} onPress={() => this.onPress(item.id)}>
      <Image style={styles.serieImage} source={{ uri: item.image }} resizeMode="stretch"></Image>
    </TouchableHighlight>
  );
};

onPickerValueChange=(value, index)=>{
  this.setState({serieType: value});
  this.loadSeries(value);
}

  render() {
    if(numColumns < 1){
      numColumns = 1;
    }
    return (
      <ScrollView style={styles.mainContainer}>
      <View style={styles.topNavigation}>
      <Picker
        selectedValue={this.state.serieType}
        style={{ height: 40, width: 150, color: '#b8b5c0'}}
        onValueChange={this.onPickerValueChange}>
        <Picker.Item label="Filme" value="Movie" />
        <Picker.Item label="Serien" value="Anime" />
      </Picker>
      </View>
        <View style={styles.serieContainer}>
          <FlatList
            style={styles.serieFlatList}
            data={this.formatData(this.state.dataSource,numColumns)}
            numColumns={numColumns}
            renderItem={this.renderItem}
            extraData={this.state.dataSource}
            keyExtractor={(item, index) => index}
          />
        </View>
      </ScrollView>
    );
  }
}

export default createBottomTabNavigator(
  {
    Home: ListSeries,
    Suche: SearchScreen,
    Settings: SettingsScreen,
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;

        let navigationIcons = {
          "Home": "ios-information-circle",
          "Suche": "ios-search",
          "Settings": "ios-options"
        };

        iconName = navigationIcons[routeName]+`${focused ? '' : '-outline'}`;

        return <Icon name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#4180A3',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: '#1A2028',
      },
    },
  }
);
const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    backgroundColor: '#0B0E11'
  },
  searchInput:{
    backgroundColor: '#1A2028',
    color: 'white'
  },
  topNavigation: {
    backgroundColor: '#1A2028'
  },
  serieFlatList: {
    flex: 1,
  },
  serieImage: {
    flex: 1,
    width: null,
    height: null,
  },
  serieButton: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: '#1A2028',
    width: null,
    height: 180,
    margin:2
  }
});
