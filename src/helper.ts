/**
 * Register new event listener safety
 * If an event listner exists, it is removed first
 * @param element
 * @param eventName
 * @param handler
 */
export function addSafeEventListener(
  element: HTMLElement,
  eventName: keyof HTMLElementEventMap,
  handler: EventListener
) {
  element.removeEventListener(eventName, handler);
  element.addEventListener(eventName, handler);
}
