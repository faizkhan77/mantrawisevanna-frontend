import React from 'react';

export interface User {
  email: string;
  name: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardTab {
  CHAT = 'CHAT',
  SCHEMA = 'SCHEMA',
  CONTEXT = 'CONTEXT',
  TRAINING = 'TRAINING'
}

export type ColorPalette = 'blue' | 'violet' | 'emerald' | 'rose' | 'amber';

// Vanna AI Component Definition
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vanna-chat': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'api-base'?: string;
        'sse-endpoint'?: string;
        'ws-endpoint'?: string;
        'poll-endpoint'?: string;
        'theme'?: 'light' | 'dark';
        'debug'?: string;
      };
    }
  }
}