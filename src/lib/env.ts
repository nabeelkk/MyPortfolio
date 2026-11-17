/** Client-side environment checks. Safe to call only in effects / event handlers. */

interface NavigatorExtras {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True when the static hero should be used (set by the inline head script). */
export const isStaticMotion = () =>
  typeof document !== "undefined" && document.documentElement.dataset.motion === "reduced";

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const isMobileViewport = () => typeof window !== "undefined" && window.innerWidth < 768;

export const isLowPowerDevice = () => {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & NavigatorExtras;
  return (
    !!n.connection?.saveData ||
    (typeof n.deviceMemory === "number" && n.deviceMemory <= 2) ||
    /(^|-)2g$/.test(n.connection?.effectiveType ?? "")
  );
};

/** Inline script (runs before paint) that marks <html> for the static/reduced experience. */
export const motionBootScript = `(function(){try{var d=document.documentElement,n=navigator,c=n.connection||{};var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches||c.saveData===true||(typeof n.deviceMemory==='number'&&n.deviceMemory<=2)||/(^|-)2g$/.test(c.effectiveType||'');d.dataset.motion=r?'reduced':'full';}catch(e){}})();`;

export const onIdle = (cb: () => void, timeout = 2000) => {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout });
  else window.setTimeout(cb, 200);
};

/** Resolve after window load + an idle slot, so heavy work never competes with first paint. */
export const afterLoadIdle = (timeout = 2500) =>
  new Promise<void>((resolve) => {
    const go = () => onIdle(resolve, timeout);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  });
