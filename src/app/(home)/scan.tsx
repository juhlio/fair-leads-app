import { useRouter } from "expo-router";

import ScanScreen from "@/components/ScanScreen";
import { createNavigation } from "@/utils/navigationAdapter";

export default function ScanRoute() {
  const router = useRouter();
  const navigation = createNavigation(router);

  return <ScanScreen navigation={navigation} />;
}
