import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let recordedAriaState: { hasProp: boolean; value: string | undefined } | null =
  null;

vi.mock('@radix-ui/react-dialog', async () => {
  const React = await import('react');
  const { forwardRef } = React;

  type DivProps = React.ComponentProps<'div'>;
  type BaseProps = { children?: ReactNode };

  const Root = ({ children }: BaseProps) => <>{children}</>;
  const Trigger = ({ children }: BaseProps) => <>{children}</>;
  const Portal = ({ children }: BaseProps) => <>{children}</>;
  const Overlay = forwardRef<HTMLDivElement, DivProps>(function MockOverlay(
    { children, ...props },
    ref,
  ) {
    return (
      <div {...props} ref={ref}>
        {children}
      </div>
    );
  });

  const Content = forwardRef<HTMLDivElement, DivProps>(function MockContent(
    { children, ...props },
    ref,
  ) {
    const { ['aria-describedby']: ariaDescribedBy, ...rest } = props;
    const hasProp = Object.prototype.hasOwnProperty.call(
      props,
      'aria-describedby',
    );
    const describedBy = hasProp
      ? (ariaDescribedBy as string | undefined)
      : undefined;

    recordedAriaState = { hasProp, value: describedBy };

    const describedByProps =
      hasProp && describedBy === undefined
        ? {}
        : {
            'aria-describedby': hasProp ? describedBy : 'mock-generated-id',
          };

    return (
      <div role="dialog" {...rest} {...describedByProps} ref={ref}>
        {children}
      </div>
    );
  });

  const Title = ({ children }: BaseProps) => <h2>{children}</h2>;
  const Description = ({ children }: BaseProps) => <p>{children}</p>;
  const Close = ({ children }: BaseProps) => (
    <button type="button">{children}</button>
  );

  return {
    __esModule: true,
    Root,
    Trigger,
    Portal,
    Overlay,
    Content,
    Title,
    Description,
    Close,
  };
});

import { Dialog, DialogContent, DialogTitle } from '../dialog';

describe('DialogContent aria-describedby 동작', () => {
  beforeEach(() => {
    recordedAriaState = null;
  });

  it('설명이 없으면 aria-describedby 속성을 제거한다', () => {
    render(
      <Dialog>
        <DialogContent showCloseButton={false}>
          <DialogTitle>다이얼로그 제목</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(recordedAriaState).not.toBeNull();
    expect(recordedAriaState?.hasProp).toBe(true);
    expect(recordedAriaState?.value).toBeUndefined();
  });
});
