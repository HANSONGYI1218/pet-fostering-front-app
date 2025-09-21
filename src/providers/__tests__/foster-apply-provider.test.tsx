import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="devtools" />,
}));

import FosterApplyProviders from '../foster-apply-provider';

describe('FosterApplyProviders', () => {
  const createClient = () => new QueryClient();

  beforeEach(() => {
    vi.resetModules();
  });

  it('프로덕션 환경에서는 Devtools를 렌더링하지 않는다', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <FosterApplyProviders queryClient={createClient()}>
        <div>child</div>
      </FosterApplyProviders>,
    );

    expect(screen.queryByTestId('devtools')).toBeNull();

    process.env.NODE_ENV = originalEnv;
  });

  it('개발 환경에서는 Devtools를 렌더링한다', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <FosterApplyProviders queryClient={createClient()}>
        <div>child</div>
      </FosterApplyProviders>,
    );

    expect(screen.getByTestId('devtools')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});
