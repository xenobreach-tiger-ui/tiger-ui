import { Theme } from '@emotion/react';
import emoStyled, { CSSObject } from '@emotion/styled';

import { TigerHTMLTag, TigerHTML } from '../types';

// --- TIGER ELEMENT --- //
// - Styled Tag
type StyledTag<Tag extends TigerHTMLTag = TigerHTMLTag> = {
  theme: Theme;
  as?: React.ElementType;
} & TigerHTML[Tag];
// - Types
type Style<StyledTag> = CSSObject | ((props: StyledTag) => CSSObject);
type PropsFunctions<Props> = ((props: Props) => CSSObject)[];

type Props<BaseProps, Tag extends TigerHTMLTag = TigerHTMLTag> = {
  [Property in keyof BaseProps]:
    ((propValue: BaseProps[Property], props: StyledTag<Tag> & BaseProps) => CSSObject)
    |
    Array<{
      value: BaseProps[Property];
      style: (CSSObject | ((propValue: BaseProps[Property], props: StyledTag<Tag> & BaseProps) => CSSObject));
      /** Sets it as the default value. If no value is entered in the target prop, this condition value will be assigned by default. */
      default?: boolean;
    }>
}

// - Tiger Element Class
export class TigerElement<
  Tag extends TigerHTMLTag = TigerHTMLTag,
  BaseProps extends { [key: string]: any } = { [key: string]: any },
> {
  // --- CONSTRUCTOR --- //
  constructor(
    {
      htmlElement,
      style,
      props,
    }: {
      htmlElement: Tag;
      style?: Style<StyledTag<Tag>>;
      props?: Props<BaseProps, Tag>;
    }
  ) {
    this.htmlElement = htmlElement;
    this.style = style ?? {};

    if (props) this.createProperty(props);
  }

  // --- PRIVATE --- //
  // - Html Element of Component
  private htmlElement: Tag;
  // - Style Values of the Component
  private style: Style<StyledTag<Tag>> = {};
  // - It holds the functions in the props values assigned to the Component and passes all style values during the rendering phase.
  private propsFunctions: PropsFunctions<StyledTag<Tag> & BaseProps> = [];

  // - Used to Create Custom Props for Components
  private createProperty(
    properties: Props<BaseProps, Tag>,
  ) {
    const propertiesKeys = Object.keys(properties);

    propertiesKeys.forEach((propertyKey) => {
      const property = properties[propertyKey];

      /*
      ** if the property took the following values:
      **
      ** example
      {
        property: (propValue, props) => ({
          '...': propValue, 
          ... // other css object values...
        }),
      }
      */
      if (typeof property === 'function') {
        this.propsFunctions.push(
          (props): CSSObject => {
            const propValue = props[propertyKey];
            return property(propValue, props);
          }
        );

        return;
      }

      /*
      ** if the property took the following values:
      **
      ** example
      {
        property: [
          {
            value: '...',
            style: {
              ...
            },
            default: true, // optional...
          },
          {
            value: '...',
            style: {
              ...
            },
            default: false, // optional...
          }
        ]
      }
      */
      if (Array.isArray(property)) {
        /* 
        ** The task of this function is to check whether the props value entered
        ** externally to the component matches a value and to give the matching style values.
        */
        const propFunction = (props: StyledTag<Tag> & BaseProps): CSSObject => {
          const getStyle = (propertyItem: any, defaultValue?: boolean): CSSObject => {
            if (typeof propertyItem.style === 'object') return propertyItem.style;

            if (typeof propertyItem.style === 'function') {
              /*
              ** The default value is assigned only when no value is entered in the
              ** corresponding prop of the component. So if "default === true", the first parameter
              ** in the callback will be assigned the default value since no external value has been entered.
              */
              const propValue = defaultValue ? propertyItem.value : props[propertyKey];
              return propertyItem.style(propValue, props);
            };

            // property not found (no style)
            return {};
          }

          const defaultCss = property.find(item => item.default);
          let css = getStyle(defaultCss, true /* default value */);

          property.forEach((propertyItem) => {
            if (propertyItem.value === props[propertyKey]) {
              css = getStyle(propertyItem, false /* not default value */);
            }
          });

          return css;
        }

        this.propsFunctions.push(propFunction);
      }
    });
  }

  // --- PUBLIC --- //
  public get reactComponent() {
    const component = emoStyled(this.htmlElement)<BaseProps>((props) => {
      let css: CSSObject = {};

      if (typeof this.style === 'object')
        css = { ...css, ...this.style };
      if (typeof this.style === 'function')
        css = { ...css, ...this.style(props) };

      this.propsFunctions.forEach((propFunction) => {
        css = {
          ...css,
          ...propFunction(props),
        };
      });

      return css;
    });

    return component;
  }
}

// - Tiger Create Element Static Function
export function createElement<
  Tag extends TigerHTMLTag = TigerHTMLTag,
  BaseProps extends { [key: string]: any } = { [key: string]: any },
> (
  {
    htmlElement,
    style,
    props,
  }: {
    htmlElement: Tag;
    style?: Style<StyledTag<Tag>>;
    props?: Props<BaseProps, Tag>
  }
) {
  const element = new TigerElement({
    htmlElement,
    style,
    props,
  });

  return element.reactComponent;
}