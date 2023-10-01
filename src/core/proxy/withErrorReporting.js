export function withErrorReporting(core, { onError }) {
  return new Proxy(core, {
    get(target, prop) {
      return (...args) => {
        try {
          const result = target[prop](...args);
          if (result && typeof result.then === 'function') {
            return result.catch(e => {
              setTimeout(() => onError(e));
              return Promise.reject(e);
            });
          } else {
            return result;
          }
        } catch(e) {
          setTimeout(() => onError(e));
          throw e;
        }
      };
    }
  });
}
