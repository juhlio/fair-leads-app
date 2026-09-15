import { useLocalSearchParams, useRouter } from "expo-router";

import ResultScreen from "@/components/ResultScreen";
import { createNavigation, parseParticipantParam } from "@/utils/navigationAdapter";

export default function ResultRoute() {
  const router = useRouter();
  const { participant } = useLocalSearchParams<{ participant?: string }>();
  const navigation = createNavigation(router);
  const route = { params: { participant: parseParticipantParam(participant) } };

  return <ResultScreen navigation={navigation} route={route} />;
}
