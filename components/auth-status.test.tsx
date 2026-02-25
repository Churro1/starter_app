import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AuthStatus } from '@/components/auth-status';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe('AuthStatus', () => {
  it('shows loading state', () => {
    mockedUseAuth.mockReturnValue({ user: null, session: null, loading: true });
    const html = renderToStaticMarkup(<AuthStatus />);
    expect(html).toContain('Checking authentication status...');
  });

  it('shows unauthenticated links', () => {
    mockedUseAuth.mockReturnValue({ user: null, session: null, loading: false });
    const html = renderToStaticMarkup(<AuthStatus />);
    expect(html).toContain('Log in');
    expect(html).toContain('Sign up');
  });

  it('shows user email when authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: { email: 'student@example.edu' } as never,
      session: null,
      loading: false,
    });

    const html = renderToStaticMarkup(<AuthStatus />);
    expect(html).toContain('Signed in as: student@example.edu');
  });
});
