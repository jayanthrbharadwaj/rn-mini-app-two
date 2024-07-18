/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity
} from 'react-native';
import { StackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {usePermissions} from './permissions';
import {RESULTS} from 'react-native-permissions';
import { EPermissionTypes } from './utils/constants';
import {CameraScanner} from './components';
import {NavigationContainer} from '@react-navigation/native';
type Props = StackScreenProps<RootStackParamList, 'App2'>;

const App: React.FC<Props> = ({ navigation, route }) => {
  const {askPermissions} = usePermissions(EPermissionTypes.CAMERA);
  const [cameraShown, setCameraShown] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState("")

 
  const takePermissions = async () => {
    askPermissions()
      .then(response => {
        //permission given for camera
        if (
          response.type === RESULTS.LIMITED ||
          response.type === RESULTS.GRANTED
        ) {
          setCameraShown(true);
        }
      })
      .catch(error => {
        if ('isError' in error && error.isError) {
          Alert.alert(
            error.errorMessage ||
              'Something went wrong while taking camera permission',
          );
        }
        if ('type' in error) {
          if (error.type === RESULTS.UNAVAILABLE) {
            Alert.alert('This feature is not supported on this device');
          } else if (
            error.type === RESULTS.BLOCKED ||
            error.type === RESULTS.DENIED
          ) {
            Alert.alert(
              'Permission Denied',
              'Please give permission from settings to continue using camera.',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Go To Settings', onPress: () => {}},
              ],
            );
          }
        }
      });
  };

  const handleReadCode = (value: string) => {
    console.log(value);
    setCameraShown(false);
    setQrCodeInput(value);
  };

  return (
    <NavigationContainer>
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>MicroFrontend - {route?.params.file}</Text>
        <View style={styles.card}>
              <Text style={styles.title}>Account Transfers</Text>
              <Text>Transfer Funds between your UNFCU deposit accounts</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Loan Payments</Text>
              <Text>Make UNFCU Loan, credit card and US mortgage payments</Text>
            </View>
            {qrCodeInput && <View style={styles.scannedText}><Text style={styles.itemText}>{"Scanned QR code: "+qrCodeInput}</Text></View>}
            
            <TouchableOpacity
            onPress={takePermissions}
            activeOpacity={0.5}
            style={styles.itemContainer}>
            <Text style={styles.itemText}>{"QR Code scanner"}</Text>
          </TouchableOpacity>
          {cameraShown && (
            <CameraScanner
              setIsCameraShown={setCameraShown}
              onReadCode={handleReadCode}
            />
      )}
      
      
      </ScrollView>
    </SafeAreaView>
    </NavigationContainer>
  );
}

const getShadowProps = (
  offset: number = 2,
  radius: number = 8,
  opacity: number = 0.2,
) => ({
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: offset,
  },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: radius,
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF8DD',
  },
  scrollContainer: {
    height: '100%',
  },
  scannedText: {
    marginVertical:20,
    marginLeft:20,
  },
  card: {
    margin:15,
    backgroundColor: '#f7f6df',
    borderRadius: 15,
    padding: 26,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,  // for Android
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heading:{
    fontWeight:'bold',
    fontSize:25,
    justifyContent:'center',
    marginBottom:20,
    color:'black',
    marginTop:15,
    marginStart:15
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  itemContainer: {
    width: '100%',
    height: 70,
    backgroundColor: 'white',
    marginTop: 10,
    justifyContent: 'center',
    ...getShadowProps(),
    paddingLeft: 20,
  },
  itemText: {
    fontSize: 17,
    color: 'black',
  },
});

export default App;
