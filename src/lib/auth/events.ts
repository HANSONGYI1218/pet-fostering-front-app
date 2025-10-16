const AUTH_CHANGE_EVENT = 'pet.auth-change';

const dispatchAsync = (target: Window) => {
  const emit = () => {
    target.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  if (typeof target.setTimeout === 'function') {
    target.setTimeout(emit, 0);
    return;
  }

  if (typeof setTimeout === 'function') {
    setTimeout(emit, 0);
    return;
  }

  emit();
};

export const dispatchAuthChangeEvent = () => {
  if (typeof window === 'undefined') {
    return;
  }

  dispatchAsync(window);
};

export const AUTH_CHANGE_EVENT_NAME = AUTH_CHANGE_EVENT;
