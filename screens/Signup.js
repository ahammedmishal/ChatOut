import React, { useContext, useState} from 'react';
import { View, Text, StyleSheet,Button,TouchableOpacity,SafeAreaView,Image,KeyboardAvoidingView,ActivityIndicator,StatusBar} from 'react-native';
import { TextInput } from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


const Signup = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('');
  const [showNext,setShowNext] = useState(false)
  const [image,setImage] = useState(null)
  const [loading,setLoading] = useState(false)



//   const signup = () =>{
//     if(email != '' && password != ''){
//       auth().createUserWithEmailAndPassword(email, password).then((res)=>{
//           console.log('response',res);
//           Alert.alert('user created successfully');
//       })
//       .catch((error) => {
//           console.log('error',error);
//           Alert.alert(error.message);
//       })   
//     }else{
  //         Alert.alert('Both fields are mandatory');
  //         Alert.alert(error.message);
  //     }
  //   }

  if(loading){
    return  <ActivityIndicator size="large" color="lightgrey" />
}
const userSignup = async ()=>{
    setLoading(true)
    if(!email || !password || !image|| !name){
           alert("please add all the field")
           return 
    }
    try{
      const result =  await auth().createUserWithEmailAndPassword(email,password)
        firestore().collection('users').doc(result.user.uid).set({
            name:name,
            email:result.user.email,
            uid:result.user.uid,
            pic:image,
            status:"online"
        })  
        setLoading(false)
    }catch(err){
        alert("something went wrong")
    }
   

}
  const pickImageAndUpload = ()=>{
    launchImageLibrary({quality:0.5},(fileobj)=>{
      console.log(fileobj);

        
     const uploadTask =  storage().ref().child(`/userprofile/${Date.now()}`).putFile(fileobj.assets[0].uri)
            uploadTask.on('state_changed', 
             (snapshot) => {
  
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if(progress==100) alert('image uploaded')
                
            }, 
            (error) => {
                alert("error uploading image")
            }, 
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                setImage(downloadURL)
                });
            }
            );
    })
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" />
      <Image source={require('../assets/bg.png')} style={styles.bg}/>
      <View style={styles.curve}></View>
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Signup</Text>
        {!showNext && 
        <>
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
        </>
        }
        {showNext ?
                <>
                 <TextInput
                 label="Name"
                 value={name}
                 onChangeText={(text)=>setName(text)}
                 mode="outlined"
                />
                <TouchableOpacity
                  style={styles.button1}
                  onPress={()=>pickImageAndUpload()}>
                    <Text style={styles.buttonText2}>SELECT PROFILE PIC</Text>
                </TouchableOpacity>
                </>
                :
                <TouchableOpacity
                  style={styles.button1}
                  onPress={()=>setShowNext(true)}>
                  <Text style={styles.buttonText1}>NEXT</Text>
                </TouchableOpacity>
        }

        <TouchableOpacity disabled={image?false:true} 
          style={[styles.button,{backgroundColor: image? '#f9524a': '#dfdfdf'}]}
          onPress={()=>userSignup()}>
            <Text style={[styles.buttonText,{color:image? 'white': '#adadad'}]}>Sign up</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.accountText}>you already have an account?</Text>
          <Text style={styles.signupText} onPress={()=>navigation.navigate('Login')}>Log In</Text>
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
  button1:{
    backgroundColor:'black',
    height:38,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
  },
  button2:{
    backgroundColor:'black',
    height:38,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginTop:40,
  },
  buttonText1:{
    color:'white',
    fontSize:15,
    fontWeight:'600',
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

export default Signup;