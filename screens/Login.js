import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet,Button,TouchableOpacity,SafeAreaView,Image,KeyboardAvoidingView,Alert ,StatusBar} from 'react-native';
import { TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';


const Login = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
  const LoginUser = () =>{
    
    auth().signInWithEmailAndPassword(email,password).then((res)=>{
        console.log('response',res);
    }).
    catch((error) =>{
        console.log('error',error);
        Alert.alert('user not found');
    })
  }

  return (
    <KeyboardAvoidingView style={styles.container} >
    <StatusBar translucent backgroundColor="transparent" />
      <Image source={require('../assets/bg.png')} style={styles.bg}/>
      <View style={styles.curve}></View>
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Login</Text>
        <TextInput
        style={styles.input}
            label="Email"
            mode='outlined'
            outlineColor='black'
            activeOutlineColor='#f9524a'
            keyboardType='email-address'
            textContentType='emailAddress'
            autoCapitalize="none"
            value={email}
            onChangeText={(text)=>setEmail(text)}
            
        />
        <TextInput
        style={styles.input}
            label="Password"
            mode='outlined'
            outlineColor='black'
            activeOutlineColor='#f9524a'
            textContentType='password'
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={(text)=>setPassword(text)}
        />

        <TouchableOpacity style={styles.button} onPress={()=>LoginUser()}>
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.accountText}>Don't have an account?</Text>
          <Text style={styles.signupText} onPress={()=>navigation.navigate('Signup')}>Sign Up</Text>
      </View>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
  },
  bg: {
    width:'100%',
    height:340,
    position:'absolute',
    top:0,
    resizeMode:'cover'
  },
  curve:{
    width:'100%',
    height:'75%',
    position:'absolute',
    bottom:10,
    backgroundColor:'#fff',
    borderTopLeftRadius: 60,
  },
  title:{
    fontSize:28,
    fontWeight:'bold',
    color:'#f9524a',
    alignSelf:'center',
    paddingBottom:0,
  },
  form:{
    flex:1,
    justifyContent:'center',
    marginHorizontal:30,
    marginTop:70
  },
  input:{
    height:33,
    marginBottom:20,
    fontSize:16,
    padding:12,
  },
  button:{
    backgroundColor:'#f9524a',
    height:58,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginTop:40,
  },
  buttonText:{
    color:'white',
    fontSize:18,
    fontWeight:'bold'
  },
  signUpContainer:{
    marginHorizontal: 20,
    justifyContent:'center',
    paddingVertical:20,
    flexDirection:'row',
    direction:'center',
  },
  accountText:{
    fontSize: 14,
    lineHeight: 13 * 1.4,
    color:'black',
    fontFamily:'red',
  },
  signupText:{
    fontSize: 14,
    lineHeight: 13 * 1.4,
    color:'black',
    marginLeft:5,
    fontWeight:'500'
  }
});

export default Login;