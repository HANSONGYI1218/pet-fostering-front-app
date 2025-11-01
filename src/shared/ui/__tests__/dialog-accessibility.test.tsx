import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Dialog, DialogContent, DialogTitle } from '../dialog';

describe('DialogContent 접근성', () => {
  it('설명 텍스트가 없으면 aria-describedby 속성을 제거한다', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogTitle>테스트 다이얼로그</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const content = screen.getByRole('dialog');
    expect(content.getAttribute('aria-describedby')).toBeNull();
  });
});
