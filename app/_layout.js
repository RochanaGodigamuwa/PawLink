import React from 'react'
import { Stack } from 'expo-router'

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}}/>
      <Stack.Screen name='User/SignIn' options={{headerShown: false}}/>
      <Stack.Screen name='Adoption/LandingPage'/>
      <Stack.Screen name='Adoption/AdoptionNotification' options={{headerTitle:"Notifications",headerTitleAlign:'center'}}/>
      <Stack.Screen name='User/Profile' options={{headerTitle:"User Profile",headerTitleAlign:'center'}}/>
      <Stack.Screen name='User/SignUp' options={{headerTitle:"Sign Up", headerTitleAlign:'center',headerShadowVisible:true}}/>
    </Stack>
  )
}

export default StackLayout