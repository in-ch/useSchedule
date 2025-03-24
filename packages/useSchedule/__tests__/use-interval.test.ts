import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useInterval from '../hooks/use-interval';

describe('useInterval unit test', () => {
  const mockAlert = vi.fn();

  beforeAll(() => {
    window.alert = mockAlert;
  });

  beforeEach(() => {
    vi.useFakeTimers();
    mockAlert.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('act callback function eact delay time', () => {
    renderHook(() =>
      useInterval(() => {
        window.alert('called');
      }, 500)
    );

    vi.advanceTimersByTime(200);
    expect(mockAlert).not.toBeCalled();

    vi.advanceTimersByTime(300);
    expect(mockAlert).toBeCalledWith('called');

    vi.advanceTimersByTime(1000);
    expect(mockAlert).toHaveBeenCalledTimes(3);
  });

  it('if the delay changes, change the repetition cycle', () => {
    let delay = 500;

    const { rerender } = renderHook(() =>
      useInterval(() => {
        window.alert('called');
      }, delay)
    );

    vi.advanceTimersByTime(1000);
    expect(mockAlert).toHaveBeenCalledTimes(2);

    delay = 200;
    rerender();

    vi.advanceTimersByTime(1000);
    expect(mockAlert).toHaveBeenCalledTimes(7);
  });
});
