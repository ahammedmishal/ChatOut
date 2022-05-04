import React,{useState,useEffect} from 'react'
import { View, Text,Image,ActivityIndicator,StyleSheet} from 'react-native'
import { GiftedChat,Bubble,InputToolbar,  Message as GiftedChatMessage,
  MessageProps,
  IMessage,} from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import FontAwesome from 'react-native-vector-icons/Ionicons'

class NoAvatarMessage extends GiftedChatMessage {
  // This fixes an issue where blank avatars are rendered;
  // https://github.com/FaridSafi/react-native-gifted-chat/issues/2093
  renderAvatar() {
    return null;
  }
}

// Render custom blank avatar messages
const CustomMessage = (props: MessageProps<IMessage>): JSX.Element => (
  <NoAvatarMessage
    {...props}
  />
);

export default function ChatScreen({user,route,navigation}) {
    const [messages, setMessages] = useState([]);
    const [profile,setProfile] = useState('')

     const {uid} = route.params;
     const getAllMessages = async ()=>{
        const docid  = uid > user.uid ? user.uid+ "-" + uid : uid+"-"+user.uid 
        const querySanp = await firestore().collection('chats')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt',"desc")
        .get()
       const allmsg = querySanp.docs.map(docSanp=>{
            return {
                ...docSanp.data(),
                createdAt:docSanp.data().createdAt.toDate()
            }
        })
        setMessages(allmsg)
     }
    useEffect(() => {
      // getAllMessages()

      const docid  = uid > user.uid ? user.uid+ "-" + uid : uid+"-"+user.uid 
        const messageRef = firestore().collection('chats')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt',"desc")

      const unSubscribe =  messageRef.onSnapshot((querySnap)=>{
            const allmsg =   querySnap.docs.map(docSanp=>{
             const data = docSanp.data()
             if(data.createdAt){
                 return {
                    ...docSanp.data(),
                    createdAt:docSanp.data().createdAt.toDate()
                }
             }else {
                return {
                    ...docSanp.data(),
                    createdAt:new Date()
                }
             }
            })
            setMessages(allmsg)
        })
        return ()=>{
          unSubscribe()
        }
        

      }, [])

      useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
              // <>
              // <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              //   <FontAwesome name="chevron-back-sharp" size={22} color='black' style={{marginLeft: 15}} onPress={()=>navigation.goBack()}/>
              //   <Image style={{
              //     width:50,
              //     height:50,
              //     borderRadius:30,
              //     borderWidth:3,
              //     borderColor:"white"
              //   }} source={{uri:profile.pic}} />
              // </View>
              // </>
                <FontAwesome name="chevron-back-sharp" size={22} color='black' style={{marginLeft: 15}} onPress={()=>navigation.goBack()}/>
            ),
        });
        firestore().collection('users').doc(user.uid).get().then(docSnap=>{
          setProfile(docSnap.data())
        }) 
    }, [navigation]);
      if(!profile){
        return  <ActivityIndicator size="large" color="lightgrey" />
      }

      const onSend =(messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy:user.uid,
            sentTo:uid,
            createdAt:new Date()
        }
       setMessages(previousMessages => GiftedChat.append(previousMessages,mymsg))
       const docid  = uid > user.uid ? user.uid+ "-" + uid : uid+"-"+user.uid 
 
       firestore().collection('chats')
       .doc(docid)
       .collection('messages')
       .add({...mymsg,createdAt:firestore.FieldValue.serverTimestamp()})

      }
    return (
        <View style={{flex:1,backgroundColor:"white",borderRadius:30}}>
           <GiftedChat
                messages={messages}
                showUserAvatar={false}
                renderMessage={CustomMessage}
                renderAvatar={() => null}

                onSend={text => onSend(text)}
                user={{
                    _id: user.uid,
                }}
       
                renderBubble={(props)=>{
                    return <Bubble
                    {...props}
                    wrapperStyle={{
                      right: {
                        backgroundColor:"#ed505c",
                      },
                      left:{
                        marginRight:10,
                        renderAvatar:null
                      },
                      
                    }}
                  />
                }}
                renderInputToolbar={(props)=>{
                    return <InputToolbar {...props}
                     containerStyle={{borderTopColor: '#f5f5f5',paddingBottom:2,paddingRight:10,backgroundColor:'white'}} 
                     textInputStyle={{ color: "black" ,backgroundColor:'#e8eaee',borderRadius:10}}
                     />
                }}
                />
        </View>
    )
}

const styles = StyleSheet.create({
  curve:{
    width:'100%',
    height:'75%',
    position:'absolute',
    bottom:10,
    backgroundColor:'#fff',
    borderTopLeftRadius: 60,
  },
});

// "Jn6rmdemhVSiqbnh651U5liUh2D2-WHFCNQxbFoR9lIWu6yznXWGMfP62"