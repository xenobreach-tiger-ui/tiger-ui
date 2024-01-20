'use client';

import { TigerElement } from '@tiger-ui/tiger-element';

export default function Page(): JSX.Element {
  const BoxElement = new TigerElement<'a', { backgroundColor?: 'red' | 'blue' }>({
    htmlElement: 'a',
    style: {
      backgroundColor: 'blue',
    },
  });

  BoxElement.createProperty({
    backgroundColor: [
      {
        if: 'blue',
        value: {
          backgroundColor: 'blue',
        },
        default: true,
      },
      {
        if: 'red',
        value: {
          backgroundColor: 'red',
        },
      },
    ],
  });

  const Box = BoxElement.render();

  return (
    <Box href="/" backgroundColor="red">
      Hello from Box!
    </Box>
  );
}
