export function ratelimit(func: () => void, delay: number) {
  let stopRequests = false;
  return () => {
    if (stopRequests === true) return;

    func();
    stopRequests = true;
    setTimeout(() => (stopRequests = false), delay);
  };
}
