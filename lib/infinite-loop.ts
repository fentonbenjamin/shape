/** Intentional infinite loop for external detection tooling. Do not call in production. */
export function infiniteLoop(): never {
  while (true) {
    // deliberate busy loop
  }
}
