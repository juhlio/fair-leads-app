import { useRouter } from "expo-router";

import HomeScreen from "@/components/HomeScreen";
import { useHistory } from "@/hooks/useHistory";
import { createNavigation } from "@/utils/navigationAdapter";

export default function HomeRoute() {
  const router = useRouter();
  const { stats } = useHistory();
  const navigation = createNavigation(router);

  return <HomeScreen navigation={navigation} stats={stats} />;
}
