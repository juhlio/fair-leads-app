const ROUTE_PATHS = {
  Home: "/",
  Scan: "/(home)/scan",
  Result: "/(home)/result",
  History: "/history",
};

function buildTarget(name, params) {
  const pathname = ROUTE_PATHS[name] ?? name;
  if (params?.participant) {
    return {
      pathname,
      params: { participant: JSON.stringify(params.participant) },
    };
  }
  return pathname;
}

export function createNavigation(router) {
  return {
    navigate(name, params) {
      router.push(buildTarget(name, params));
    },
    replace(name, params) {
      router.replace(buildTarget(name, params));
    },
  };
}

export function parseParticipantParam(raw) {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return undefined;
  }
}
