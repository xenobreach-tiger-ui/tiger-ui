<p align="center">
  <img src="https://github.com/tiger-uix/tiger-element/assets/92295550/7e100b56-1bca-4066-88f8-54e08f113651" alt="Tiger UI logo" height="150" width="150">
  <h1 align="center" style="color: #26dba9">Tiger Element</h1>
</p>

The Tiger Element enables you to create React components easily and more legibly using the Emotion library. You can define style values for your components effortlessly and add customizable component properties along the way.

### Quick Start

Import and start creating your element.

```bash
npm install @tiger-ui/tiger-element @emotion/react @emotion/styled
```
or
```bash
yarn add @tiger-ui/tiger-element @emotion/react @emotion/styled
```



Create your element:
```tsx
import { TigerElement } from '@tiger-ui/tiger-element';

/* CREATE ELEMENT */
const BoxRootElement = new TigerElement({
  htmlElement: 'div',
  style: {
    maxWidth: '300px',
    display: 'inline-block',
  },
});

/* CREATE ELEMENT PROPS */
BoxRootElement.createProperty({
  bgColor: (props) => ({
    backgroundColor: props.bgColor,
  }),
});

/* DEFINE ELEMENT */
const Box = BoxRootElement.render();
```

Use element:
```tsx
function MyComponent() {
  return (
    <Box bgColor="#fc0000">
      Hello from Box!
    </Box>
  );
}
```
