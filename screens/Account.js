import React,{useEffect,useState} from 'react'
import { View, Text,ActivityIndicator ,StyleSheet,Image, StatusBar} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Feather from 'react-native-vector-icons/Feather'
import {Button} from 'react-native-paper'
import auth from '@react-native-firebase/auth'

export default function AccountScreen({user}) {
     const [profile,setProfile] = useState('')

     useEffect(()=>{
     firestore().collection('users').doc(user.uid).get().then(docSnap=>{
        setProfile(docSnap.data())
     })
     },[])
     if(!profile){
        return  <ActivityIndicator size="large" color="#lightgrey" />
    }

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={'#ffff'}
                barStyle="dark-content" 
                translucent
            />
            <View style={{flex:1,justifyContent:"space-between"}}>
                <View style={{alignItems:'center'}}>
                    <Image style={styles.img} source={{uri:profile.pic}} />
                    <Text style={styles.text}>Name: {profile.name}</Text>
                    <View style={{marginTop:10}}>
                        <View style={{flexDirection:"row"}}>
                            <Feather name="mail" size={30} color="#f9524a" />
                            <Text style={[styles.text,{marginLeft:10}]}>{profile.email}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Button
                        style={styles.btn}
                        mode="contained"
                        onPress={()=>{
                            firestore().collection('users')
                            .doc(user.uid)
                            .update({
                            status:firestore.FieldValue.serverTimestamp()
                            }).then(()=>{
                                auth().signOut();
                            })
                        }}
                    >Logout</Button>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffff",
    },
    img:{
        width:200,
        height:200,
        borderRadius:100,
        borderWidth:3,
        borderColor:"white"
    },
    text:{
        fontSize:23,
        color:"black"
    },
    btn:{
        alignSelf:'center',
        borderColor:"white",
        borderWidth:3,
        marginBottom:20,
        width:"90%"
    }
})