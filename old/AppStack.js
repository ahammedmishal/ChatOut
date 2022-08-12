import React,{useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import { AuthContext } from './AuthProvider';
import ChatScreen from '../screens/Chat';
const Stack = createStackNavigator();

function AppStack({props}) {
  const {user} = useContext(AuthContext)
    return (
      <Stack.Navigator defaultScreenOptions={Home} screenOptions={{headerTitleAlign:'center'}}>
        <Stack.Screen name="Home" options={{title:'ChatOut'}} component={Home} />
        <Stack.Screen name="Chat" options={({ route }) => ({ title: route.params.name})}>
          {
            props => <ChatScreen {...props} user={user} />
          }
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

export default AppStack;