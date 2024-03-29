import React,{useState,useEffect,useContext,useLayoutEffect,useCallback} from 'react'
import { View, Text,TouchableOpacity } from 'react-native'
import { GiftedChat,Bubble,InputToolbar} from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../navigation/AuthProvider'
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

  export default function Chat() {

    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();


    const onSignOut = () => {
        auth().signOut().catch(error => console.log('Error logging out: ', error));
      };

      useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 10
              }}
              onPress={onSignOut}
            >
              <AntDesign name="logout" size={24} color="lightgrey" style={{marginRight: 10}}/>
            </TouchableOpacity>
          )
        });
      }, [navigation]);


    useLayoutEffect(() => {
        const collectionRef= firestore().collection('chats')
        .doc(_id)
        .collection('messages')
        .orderBy('createdAt',"desc")

    const unsubscribe = collectionRef.onSnapshot((querySnapshot => {
          setMessages(
            querySnapshot.docs.map(doc => ({
              _id: doc.data()._id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              user: doc.data().user
            }))
          );
        }));
    return unsubscribe;
      }, []);


    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages)
        );
        // setMessages([...messages, ...messages]);
        const { _id, createdAt, text, user } = messages[0];    
        firestore().collection('chats'), {
          _id,
          createdAt,
          text,
          user
        };
      }, []);

      return (

        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={false}
          showUserAvatar={false}
          onSend={messages => onSend(messages)}
          messagesContainerStyle={{
            backgroundColor: '#fff'
          }}
          textInputStyle={{
            backgroundColor: '#fff',
            borderRadius: 20,
          }}
          user={{
            _id: auth?.currentUser?.email,
            avatar: 'https://i.pravatar.cc/300'
          }}
        />
      );
}