import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';

const resetMock = vi.fn();
const addFilesMock = vi.fn<
  (files: FileList | File[], current?: string[]) => string[]
>();
const removeImageMock = vi.fn<(target: string, current?: string[]) => string[]>();
const clearMock = vi.fn();
const resolveMock = vi.fn<
  (token: string, images: string[]) => Promise<{ images: string[]; uploadedCount: number }>
>();

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

vi.mock('@/lib/auth/session', () => ({
  resolveStoredAccessToken: vi.fn(() => 'token'),
}));

vi.mock('@/features/foster/api/foster', () => ({
  createAnimal: vi.fn(),
  updateAnimal: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'animal-id' }),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock('lucide-react', () => ({
  CalendarIcon: () => null,
  Loader2: () => null,
  Plus: () => null,
}));

vi.mock('@/shared/hooks/use-image-upload-store', () => ({
  useImageUploadStore: vi.fn(() => ({
    addFiles: addFilesMock,
    removeFile: removeImageMock,
    clear: clearMock,
    resolve: resolveMock,
  })),
}));

vi.mock('@/shared/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogClose: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/shared/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <div />,
}));

vi.mock('@/shared/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
  FormControl: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormField: ({
    name,
    render,
  }: {
    name: string;
    render: (args: { field: { value: unknown; onChange: () => void } }) => React.ReactNode;
  }) => {
    let value: unknown = '';
    if (name === 'images') {
      value = [];
    } else if (
      name === 'birth_date' ||
      name === 'current_foster_start_date' ||
      name === 'current_foster_end_date'
    ) {
      value = undefined;
    }

    return <div>{render({ field: { value, onChange: () => undefined } })}</div>;
  },
  FormItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  FormMessage: () => null,
}));

vi.mock('@/shared/ui/input', () => ({
  Input: (props: React.ComponentProps<'input'>) => <input {...props} />,
}));

vi.mock('@/shared/ui/textarea', () => ({
  Textarea: (props: React.ComponentProps<'textarea'>) => <textarea {...props} />,
}));

vi.mock('@/shared/ui/calendar', () => ({
  Calendar: () => <div />,
}));

vi.mock('@/shared/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/widgets/form/selected-button', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/widgets/feedback/empty-box', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/widgets/feedback/need-login-badge', () => ({
  __esModule: true,
  default: () => <div />,
}));

vi.mock('react-hook-form', () => {
  const ReactHooks = require('react');
  return {
    useForm: () => {
      const formRef = ReactHooks.useRef<{
        control: Record<string, never>;
        handleSubmit: (cb: () => void) => () => void;
        reset: typeof resetMock;
        formState: { isSubmitting: boolean; errors: Record<string, never> };
        watch: () => unknown[];
      } | null>(null);

      if (!formRef.current) {
        formRef.current = {
          control: {},
          handleSubmit: (cb: () => void) => () => cb(),
          reset: ((...args) => resetMock(...args)) as typeof resetMock,
          formState: { isSubmitting: false, errors: {} },
          watch: () => [],
        };
      }

      return formRef.current;
    },
  };
});

beforeEach(() => {
  resetMock.mockClear();
  addFilesMock.mockReset();
  addFilesMock.mockImplementation((_files, current = []) => [...current]);
  removeImageMock.mockReset();
  removeImageMock.mockImplementation((_target, current = []) =>
    (current ?? []).filter((value) => value !== _target),
  );
  clearMock.mockReset();
  resolveMock.mockReset();
  resolveMock.mockResolvedValue({ images: [], uploadedCount: 0 });
});

describe('AniamlCreateDialog', () => {
  it('동일한 렌더에서 불필요하게 reset을 반복 호출하지 않는다', async () => {
    const { AniamlCreateDialog } = await import('../animal-create-dialog');

    const { rerender } = render(<AniamlCreateDialog />);

    await waitFor(() => {
      expect(resetMock).toHaveBeenCalledTimes(1);
      expect(clearMock).toHaveBeenCalledTimes(1);
    });

    rerender(<AniamlCreateDialog />);

    await waitFor(() => {
      expect(resetMock).toHaveBeenCalledTimes(1);
      expect(clearMock).toHaveBeenCalledTimes(1);
    });
  });
});
