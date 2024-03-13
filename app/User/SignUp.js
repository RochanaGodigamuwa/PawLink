import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database';
import { FIREBASE_APP } from '../../FirebaseConfig';
import { CheckBox, Icon } from 'react-native-elements';

// Initialize Firebase authentication, Firestore, and Realtime Database
const auth = getAuth(FIREBASE_APP);
const dbFirestore = getFirestore(FIREBASE_APP);
const dbRealtime = getDatabase(FIREBASE_APP);

const SignupScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMaleSelected, setIsMaleSelected] = useState(false);
  const [isFemaleSelected, setIsFemaleSelected] = useState(false);

  const handleMaleSelection = () => {
    setGender("Male");
    setIsMaleSelected(true);
    setIsFemaleSelected(false);
  };

  const handleFemaleSelection = () => {
    setGender("Female");
    setIsFemaleSelected(true);
    setIsMaleSelected(false);
  };


  const handleSignup = async () => {
    // Check if any of the required fields are empty
    if (!firstName || !lastName || !email || !password || !confirmPassword || (!isMaleSelected && !isFemaleSelected)) {
      alert('All fields are required');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {

      const profilePicture = "https://firebasestorage.googleapis.com/v0/b/pawlink-9dcc9.appspot.com/o/men.png?alt=media&token=c96a8222-0c67-49d5-a0b0-6cfd1e6b8521";

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Successfully Signed Up!");
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: profilePicture
      });

      // Save user data to Firestore
      await setDoc(doc(dbFirestore, 'Users', user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        UserType: 'Pet Owner',
        gender: gender,
        profilePicture: profilePicture
      });

      // Save user data to Realtime Database
      await set(ref(dbRealtime, 'Users/' + user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        UserType: 'Pet Owner',        
        gender: gender,
        profilePicture: profilePicture
      });

      Alert.alert('','successfully signed up!');
      router.replace('./SignIn');

    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <View className = "flex-1 items-center mt-24">
      <Image
        source={require('../../assets/images/pawlink1.png')} 
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={text => setFirstName(text)} 
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={text => setLastName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={text => setPassword(text)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={text => setConfirmPassword(text)}
      />

      {/* Male or Female */}
      <View className = "flex-row">
        <CheckBox
          title='Male'
          checked={isMaleSelected}
          onPress={handleMaleSelection}
        />
        <CheckBox
          title='Female'
          checked={isFemaleSelected}
          onPress={handleFemaleSelection}
        />
        </View> 
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define styles
const styles = StyleSheet.create({
  logo: {
    width: '80%', 
    height: '20%', 
    resizeMode: 'contain', 
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  checkboxContainer: {
    justifyContent: 'space-between',
    width: '60%', 
    marginBottom: 20, 
  },
  signupButton: {
    backgroundColor: '#263c9e',
    padding: 10,
    borderRadius: 10,
    width: '50%',
    marginTop: 20, 
  },
  signupButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SignupScreen;
