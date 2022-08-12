import React,{useEffect,useState} from 'react';
import { LogBox } from "react-native";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image
} from 'react-native';
import 'react-native-gesture-handler';
import { ActivityIndicator, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import firestore from '@react-native-firebase/firestore'
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import ChatScreen from './screens/Chat';
import AccountScreen from './screens/Account';
import SplashScreen from 'react-native-splash-screen';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f9524a',
    secondary:'black'
  },
};


const Stack = createStackNavigator();

const Navigation = ()=>{
  const [user,setuser] = useState('')
  const [profile,setProfile] = useState('')
  useEffect(()=>{
   const unregister =  auth().onAuthStateChanged(userExist=>{
      if(userExist){
       
        firestore().collection('users')
        .doc(userExist.uid)
        .update({
          status:"online"
        })
        setuser(userExist)
      } 
      else setuser("")
    });
    firestore().collection('users').doc(user.uid).get().then(docSnap=>{
      setProfile(docSnap.data())
    }) 

    return ()=>{
      unregister()
  
    }
    
  },[])
  return (
    <NavigationContainer>
      <Stack.Navigator
       screenOptions={{
         headerTintColor:"black"
       }}
      >
        {user?
        <>
        <Stack.Screen name="Home" options={{
          title:"ChatOut",
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#f9524a',
            height:65,
          },
          headerTitleStyle: {
            color: 'white'
          }
        }}> 
         {props => <Home {...props}  user={user} />}
        </Stack.Screen>

        <Stack.Screen name="Chat" options={({ route }) => ({ title:
      
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            {/* <Image style={{
                  width:50,
                  height:50,
                  borderRadius:30,
                  resizeMode:'cover'
                }} 
            source={{uri:route.params.pic}} /> */}
              {/* <View style={{marginLeft:15}} >
                <Text style={{color:'white',fontSize:18,fontWeight:'600'}} >{route.params.name}</Text>
                <Text style={{color:'#1e1e1e',fontSize:13}} >{route.params.status}</Text>
              </View> */}
          </View>,
          headerStyle: {
            backgroundColor: '#f9524a',
            height:65
          },
        })}>
          {props => <ChatScreen {...props} user={user} /> }
        </Stack.Screen>
        <Stack.Screen name="Account">
          {props => <AccountScreen {...props} user={user}/> }
        </Stack.Screen>
        </>
        :
        <>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}}/>
        </>
        }
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])


  return (
    <>
      <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="#f9524a" />
       <View style={styles.container}>
         <Navigation />
       </View>
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
   container:{
     flex:1,
     backgroundColor:"white"
   }
});

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

export default App;