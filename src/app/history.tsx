import { useRouter } from "expo-router";

import HistoryScreen from "@/components/HistoryScreen";
import { createNavigation } from "@/utils/navigationAdapter";

export default function HistoryRoute() {
  const router = useRouter();
  const navigation = createNavigation(router);

  return <HistoryScreen navigation={navigation} />;
}
