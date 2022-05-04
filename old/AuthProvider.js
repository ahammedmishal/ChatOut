import React, {createContext, useState} from 'react';
import { View, Text, StyleSheet,Button,TouchableOpacity,SafeAreaView,Image,Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
  
    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          login: async (email, password) => {
            auth().signInWithEmailAndPassword(email,password).then((res)=>{
                console.log('response',res);
            }).
            catch((error) =>{
                console.log('error',error);
                Alert.alert('user not found',error.message);
            })
          },
          register: async (email,password,image,name)=>{
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
            }catch(err){
                alert("something went wrong")
            }
        },
          logout: async () => {
            try {
              await auth().signOut();
            } catch (e) {
              console.log(e);
            }
          },
        }}>
        {children}
      </AuthContext.Provider>
    );
  };

export default AuthProvider;