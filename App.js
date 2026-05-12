import { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LauncherScreen from './src/screens/LauncherScreen';
import PrototypeScreen from './src/screens/PrototypeScreen';

export default function App() {
  const [screen, setScreen] = useState('launcher');

  const open = useCallback((key) => setScreen(key), []);
  const back = useCallback(() => setScreen('launcher'), []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {screen === 'launcher' ? (
        <LauncherScreen onOpen={open} />
      ) : (
        <PrototypeScreen prototype={screen} onBack={back} />
      )}
    </SafeAreaProvider>
  );
}
