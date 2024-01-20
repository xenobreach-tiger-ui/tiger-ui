import { Theme } from '@emotion/react';
import styled, { CSSObject } from '@emotion/styled';

import { TigerHTMLTag, TigerHTML } from './types';

type StyledTag<Tag extends TigerHTMLTag = TigerHTMLTag> = {
  theme: Theme;
  as?: React.ElementType;
} & TigerHTML[Tag];

// --- TIGER ELEMENT TYPES --- //
type Style = CSSObject | ((props: any) => CSSObject);
type PropsLogics = ((props: any) => CSSObject)[];

class TigerElement<
  Tag extends TigerHTMLTag = TigerHTMLTag,
  BaseProps extends { [key: string]: any } = { [key: string]: any },
> {
  private htmlElement: Tag;
  private style: Style = {};
  private propsLogics: PropsLogics = [];

  constructor(
    { htmlElement, style }: {
      htmlElement: Tag;
      style?: Style;
    }
  ) {
    this.htmlElement = htmlElement;
    this.style = style ?? {};
  }

  public createProperty(
    properties: {
      [Property in keyof BaseProps]:
        ((props: StyledTag<Tag> & BaseProps) => CSSObject)
        |
        Array<{
          if: BaseProps[Property];
          value: (CSSObject | ((props: StyledTag<Tag> & BaseProps) => CSSObject));
          default?: boolean;
        }>
    },
  ) {
    const propertiesKeys = Object.keys(properties);

    propertiesKeys.forEach((propertyKey) => {
      const property = properties[propertyKey as keyof BaseProps] as (
        ((props: any) => CSSObject)
        | any[]
      );

      if (typeof property === 'function') {
        this.propsLogics.push(property);

        return;
      }

      if (Array.isArray(property)) {
        const p = property as Array<{
          if: any;
          value: (CSSObject | ((props: StyledTag<Tag> & BaseProps) => CSSObject))
          default?: boolean;
        }>;

        p.forEach((pItem) => {
          const callback = (props: StyledTag<Tag> & BaseProps) => {
            if (pItem.default) {
              if (typeof pItem.value === 'object') return pItem.value;
              if (typeof pItem.value === 'function') return pItem.value(props);
            }

            if (pItem.if !== props[propertyKey as keyof BaseProps]) return {};

            if (typeof pItem.value === 'object') return pItem.value;
            if (typeof pItem.value === 'function') return pItem.value(props);

            return {};
          };

          this.propsLogics.push(callback);
        });
      }
    });
  }

  public render() {
    return styled(this.htmlElement)<BaseProps>((props) => {
      let css: CSSObject = {};

      if (typeof this.style === 'object')
        css = { ...css, ...this.style };
      if (typeof this.style === 'function')
        css = { ...css, ...this.style(props) };

      this.propsLogics.forEach(
        (callback) => {
          css = {
            ...css,
            ...callback(props),
          };
        }
      );

      return css;
    });
  }
}

export { TigerElement };
