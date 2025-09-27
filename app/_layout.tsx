import { Stack } from "expo-router";

const RootLayout = () => {
  return <Stack 
  screenOptions={{ headerShown: false }} //dont show header
  />; //literally a stack. like a stack of plates
  //can get away with slot for now, if map and location select are modals
}

export default RootLayout;