export function withSimulatedNetworkLatency(data, { minLatency, maxLatency }) {
  return new Proxy(data, {
    get(target, prop) {
      const synchronousMethods = new Set(["onShoppingListUpdate", "offShoppingListUpdate"]);
      if (synchronousMethods.has(prop)) {
        return target[prop];
      }
      const latency = Math.random() * (maxLatency - minLatency) + minLatency;
      return (...args) => {
        console.info(`[${latency.toFixed(0)}ms] data.${prop}(${args.map(x => JSON.stringify(x)).join(',')}) (called from`,
          (new Error()).stack.split("\n").slice(1, 6).map(x => x.split('@')[0]?.trim()).join(' < '), ')');
        return new Promise(x => setTimeout(x, latency))
          .then(() => target[prop](...args));
      };
    }
  });
}
