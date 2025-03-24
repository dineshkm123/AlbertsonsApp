// import { Stack } from "expo-router";
// import { View, Text, StyleSheet } from "react-native";

// export default function Layout() {
//   return (
//     <View style={styles.container}>

//       <View style={styles.header}>
//         <Text style={styles.headerText}> Albertsons International private limited
//         </Text>
//       </View>

//       {/* Stack Navigation */}
//       <View style={styles.content}>
//         <Stack screenOptions={{ headerShown: false }} />
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>© 2025 My App</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     height: 60,
//     backgroundColor: "#007bff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerText: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   content: {
//     flex: 1, // Takes remaining space
//   },
//   footer: {
//     height: 50,
//     backgroundColor: "#007bff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   footerText: {
//     color: "white",
//     fontSize: 16,
//   },
// });

import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import {DeviceProvider} from "../app/Devicecontext"
export default function Layout() {
  return (
    <DeviceProvider>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </DeviceProvider>

  );
}

