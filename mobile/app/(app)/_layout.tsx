import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0D0D0D" },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="history" />
      <Stack.Screen name="biometrics" />
      <Stack.Screen name="vials" />
      <Stack.Screen name="protocol" />
      <Stack.Screen name="protocols" />
    </Stack>
  );
}
