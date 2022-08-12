import React, { useContext,useEffect,useState,useLayoutEffect } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity,FlatList,ActivityIndicator} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import auth from '@react-native-firebase/auth';
import {FAB} from 'react-native-paper'
import ColorPropType from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';
const catImageUrl = "https://instagram.fcok4-1.fna.fbcdn.net/v/t51.2885-19/275856902_765699121485591_1813311605637913241_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fcok4-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=wYcOIoMkMbMAX_j6QoI&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT9wVYz2NF12J4KITRx0HET_XYq6evOyAA5y7YBAYpMBqg&oe=623E19BF&_nc_sid=7bff83";


const Home = ({user,navigation}) => {

  const [users,setUsers] = useState(null)
  const [profile,setProfile] = useState('')


    const getUsers = async ()=>{
        const querySanp = await firestore().collection('users').where('uid','!=',user.uid).get()
        const allusers = querySanp.docs.map(docSnap=>docSnap.data())
            //  console.log(allusers)
            console.log("Userszzzz",user);
        setUsers(allusers)
    }
    const getImage = async ()=>{
        const imageSnap = await firestore().collection('users').doc(user.uid).get()
        setProfile(imageSnap.data())
        console.log('@PROFILEADD',profile);
    }

    useEffect(()=>{
        getUsers();
    },[])

    const RenderCard = ({item})=>{
      return (
          <TouchableOpacity onPress={()=>navigation.navigate('Chat',{name:item.name,uid:item.uid,pic:item.pic,
            status :typeof(item.status) =="string"? item.status : item.status.toDate().toString()
        })}>
          <View style={styles.mycard}>
              <Image source={{uri:item.pic}} style={styles.img}/>
              <View>
                  <Text style={styles.text}>
                      {item.name}
                  </Text>
                  <Text style={styles.text}>
                      {item.email}
                  </Text>
              </View>
          </View>
          </TouchableOpacity>
        )
      }

      useLayoutEffect(() => {
        getImage();
        console.log('@1PROFILEADD',profile);
        navigation.setOptions({
            headerRight: () => (
              <TouchableOpacity>
                <Image
                    source={{ uri: profile.pic}}
                    style={{
                        width: 40,
                        height: 40,
                        marginRight: 15,
                        borderRadius:20,
                        backgroundColor:'white'
                    }}
                />
              </TouchableOpacity>
            ),
        });
    }, [navigation]);


  return (
      <>
        {profile?
      <View style={styles.container}>
        {/* <Text style={styles.title}>Welcome {user.uid}</Text> */}

        <FlatList 
            data={users}
            renderItem={({item})=> {return <RenderCard item={item} /> }}
            keyExtractor={(item)=>item.uid}
        />
        <FAB
            style={styles.fab}
            icon={
            props=> <Entypo name="chat" size={24} color="white"/>
            }
            color="white"
            onPress={() => navigation.navigate("Account")}
        />
      </View>
      :
      <ActivityIndicator size="large" color="lightgrey" />
      }
        
      </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
  },
   button:{
    backgroundColor:'#46cbff',
    height:28,
    width:80,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    marginBottom:10
   },
   buttonText:{
    color:'white',
    fontSize:15,
    fontWeight:'bold',
  },
  title:{
    fontSize:16,
    fontWeight:'bold',
    color:'#a5a5a5',
    alignSelf:'center',
    paddingBottom:0,
  },
  img:{width:60,height:60,borderRadius:30,backgroundColor:"lightgrey"},
  text:{
      fontSize:18,
      marginLeft:15,
      color:'#444444'
  },
  mycard:{
      flexDirection:"row",
      margin:3,
      padding:4,
      backgroundColor:"white",
      marginTop:10
  },
  fab: {
   position: 'absolute',
   margin: 16,
   right: 0,
   bottom: 0,
   shadowColor: "#f9524a",
   backgroundColor:"#f9524a"
 },
});

export default Home;