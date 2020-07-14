import React,{useState} from 'react';
import axios from 'axios';
import { Video } from 'expo-av';

import { StyleSheet, View,Text, TextInput, ScrollView, Image, TouchableHighlight,TouchableOpacity, Modal, Button, Linking, Dimensions } from 'react-native';

export default function App() {
  const { width } = Dimensions.get('window')-10;
const apiurl = "https://api.rawg.io/api/games?page_size=5";
const [state, setState]= useState({
  s:"Enter a game ...",
  results: [],
  selected: {}
});
const search = () => {
  axios(apiurl +  "&search="+state.s.toUpperCase()).then(({data})=>{
    let results = data.results
    console.log(results)
    setState(prevState=>{
      return{
        ...prevState,
        results: results
      }
    })
  })
}
const openPopup = (slug) => {
  axios("https://api.rawg.io/api/games/"+slug).then(({data})=>{
    let result=data;
    console.log(result)
    setState(prevState =>{
      return{...prevState, selected: result}
    });
  });
  }

  return (
    <View style={styles.container}>
  <Text style={styles.title}> GameSpace</Text>
   <TextInput style={styles.searchbox} onChangeText={text => setState(prevState =>{
     return{
       ...prevState,
       s:text
     }
   })} value={state.s} onSubmitEditing={search} />
<ScrollView style={styles.results}>
{state.results.slice(0,1).map(result =>(
  <TouchableHighlight key={result.slug} onPress={()=>openPopup(result.slug)} >
  <View  style={styles.result}>
    <Image source={{uri: result.background_image}}
    style={{width:320, height:350, alignItems:'center',justifyContent:'center'}}
    resizeMode="cover" />
<Text style={styles.heading}>{result.name}</Text>
  </View>
  </TouchableHighlight>
))}
</ScrollView>
<Modal animationType="fade" style={styles.modal} transparent={false} visible={(typeof state.selected.name != "undefined")}>
      <ScrollView>
        <View style={styles.popup}> 
<Text style={styles.poptitle}>{state.selected.name}</Text>
<Image source={{uri: state.selected.background_image}}
    style={{margin:10,width:"95%", height:300, alignItems:'center',justifyContent:'center'}}
    resizeMode="cover" />
    <Text style={styles.director}>Released on {state.selected.released}</Text>
    <Text style={styles.released}>Rating:{state.selected.rating}</Text>
       {
  state.selected.clip && (
    <Video
      source={{uri: state.selected.clip.clip}}
      rate={1.0}
      volume={1.0}
      isMuted={false}
      resizeMode="contain"
      shouldPlay={false}
      isLooping={true}
      useNativeControls
      style={{width, height: 300,marginLeft:5,marginRight:5}}
    />
  )
}
    <Text style={styles.plot}>{state.selected.description_raw}</Text>
    <View>
      <Text style={styles.released}>Join discussion on Reddit</Text>
        <View>
    <TouchableOpacity onPress={()=>Linking.openURL(state.selected.reddit_url)}>
      <Text style={styles.reddit}>reddit</Text>
    </TouchableOpacity>
    </View>

    </View>
    <Text style={styles.released}>Checkout on the following store</Text>
    {state.selected.stores && (
    <TouchableOpacity onPress={() => Linking.openURL(state.selected.stores[0].url)}>
      <View style={styles.store}>
  <Text style={styles.storeLink}>
    {state.selected.stores[0].store.name}
  </Text>
  </View>
  </TouchableOpacity>
    )
    }

    </View>
        </ScrollView>
 <Button style={styles.Button} onPress={()=>setState(prevState =>{
          return{...prevState, selected: {}}
        })} title="Close"/>
        </Modal>
    </View>
  );
}

const styles= StyleSheet.create({
 container: {
   flex:1,
   backgroundColor:'#27282e',
   justifyContent:'flex-start',
   alignItems:'center',
   paddingTop:75,
   paddingHorizontal: 20
 },
 title : {
color:'white',
fontSize:32,
textAlign:'center',
fontWeight:'700',
marginBottom:20
 },
 searchbox: {
  fontSize:22,
  fontWeight:'300',
  padding:20,
  width:"100%",
  backgroundColor:'white',
  borderRadius:8,
  marginBottom: 40
 },
 results: {
   flex:1
 },
 result: {
   width: '100%',
   marginBottom: 18,
 },
 heading: {
   color:'white',
   fontSize:18,
   padding:20,
   fontWeight:'700',
   backgroundColor:'#445565',
   textAlign:'center'
 },
 popup: {
   backgroundColor:'#282828'
 },
 poptitle: {
  color:'white',
   marginTop:10,
   textAlign:"center",
   fontWeight:'700',
   fontSize:35
 },
 rating: {
   color:'white',
   fontSize:22,
   textAlign:'center',
   fontWeight:'700',
   marginBottom:10
 },
 director: {
  color:'white',
  fontSize:25,
  textAlign:'center',
  fontWeight:'700'
},
plot: {
  color:'white',
  marginLeft:10,
  marginRight:10,
  marginTop:7,
  textAlign:"center",
  alignContent:'center',
  fontSize:15,
  fontWeight:'500',
  marginBottom:10
},
released:{
  color:'white',
  marginTop:5,
  textAlign:'center',
  fontSize:18,
  fontWeight:'bold',
  marginBottom:7
},
Actors:{
  textAlign:'center',
  marginLeft:10,
  marginRight:10,
  marginTop:5,
  fontWeight:'700',
  fontSize:20,
},
Button: {
  alignContent:'center',
  textAlign:'center',
  color:'white',
  fontSize:25,
  fontWeight:'700',
  padding:80
},
storeLink: {
  color:'white',
  backgroundColor:'black',
  fontSize:18,
  fontWeight:'700',
  textAlign:'center'
},
store: {
  textAlign:'center',
  alignItems:'center',
  backgroundColor:'black',
  padding:15,
  borderRadius:9,
  marginLeft:70,
  marginRight:70,
  marginBottom:15
},
reddit: {
  textAlign:'center',
  backgroundColor:'orange',
  color:'white',
  padding:12,
  borderRadius:5,
  marginBottom:10,
  marginLeft:120,
  marginRight:120,
}
});

