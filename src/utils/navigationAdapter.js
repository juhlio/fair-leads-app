const ROUTE_PATHS = {
  Home: "/(home)",
  Scan: "/(home)/scan",
  Result: "/(home)/result",
  History: "/history",
};

export function createNavigation(router) {
  return {
    navigate(name, params) {
      const pathname = ROUTE_PATHS[name] ?? name;
      if (params?.participant) {
        router.push({
          pathname,
          params: { participant: JSON.stringify(params.participant) },
        });
      } else {
        router.push(pathname);
      }
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
