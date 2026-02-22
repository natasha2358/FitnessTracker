@echo off
echo Installing dependencies...
call npx create-expo-app@latest . --template expo-template-blank-typescript --no-install
call npm install
call npx expo install expo-sqlite expo-haptics @react-native-async-storage/async-storage
call npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
call npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
call npm install @gorhom/bottom-sheet
call npm install react-native-calendars
call npm install zustand
call npm install uuid
call npm install --save-dev @types/uuid
echo.
echo All done npx expo start
