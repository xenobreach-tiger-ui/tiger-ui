'use client';

import React from 'react';
import { createElement } from '@tiger-ui/react';

const Box = createElement<'a', { color?: 'red' | 'blue', backgroundColor?: string }>({
  htmlElement: 'a',
  style: {
    backgroundColor: 'black',
  },
  props: {
    color: [
      {
        value: 'blue',
        style: (value) => ({
          backgroundColor: value,
          color: 'white',
        }),
      },
      {
        value: 'red',
        style: {
          color: 'red',
        },
        default: true,
      },
    ],
  },
});

export default function Page(): JSX.Element {
  return (
    <>
      <Box href="/">
        Hello from Box!
      </Box>
    </>
  );
}
