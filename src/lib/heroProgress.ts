/** Tiny shared store for hero scroll progress (0–1), read by the canvas/3D scene each frame. */
type Listener = (p: number) => void;

const state = { value: 0 };
const listeners = new Set<Listener>();

export const heroProgress = {
  get: () => state.value,
  set(v: number) {
    state.value = v;
    listeners.forEach((l) => l(v));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
