import { describe, it, expect } from 'vitest';
import RootLayout, { metadata } from '@/app/layout';

describe('RootLayout', () => {
  it('declares the site-wide metadata', () => {
    expect(metadata.title).toBe('TNP — Premium Solid Wood Flooring & Custom Timber Furniture | Biên Hòa, Vietnam');
    expect(metadata.description).toBe('Factory-direct solid wood flooring and custom timber furniture. Keyaki, Hinoki, oak, walnut — manufactured to the highest Japanese standards in our own facility in Biên Hòa, Vietnam. Serving Vietnam, Japan, and international buyers.');
  });

  it('wraps children in an <html lang="en"> / <body> shell', () => {
    const element = RootLayout({ children: 'hello' });
    expect(element.type).toBe('html');
    expect(element.props.lang).toBe('en');

    const body = element.props.children as React.ReactElement;
    expect(body.type).toBe('body');
    const bodyChildren = body.props.children as React.ReactNode[];
    expect(bodyChildren[0]).toBe('hello');
  });

  it('declares favicon via metadata.icons', () => {
    const icons = metadata.icons as { icon: { url: string }[]; shortcut: string };
    expect(icons.icon[0].url).toContain('favicon.ico');
    expect(icons.icon[1].url).toContain('favicon-192.png');
    expect(icons.shortcut).toContain('favicon.ico');
  });
});
