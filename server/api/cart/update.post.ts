import {shopifyFetch} from '../../utils/shopify';

const CART_UPDATE = `
  mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const data = await shopifyFetch(CART_UPDATE, {
    cartId: body.cartId,
    lines: body.lines,
  });

  return data.cartLinesUpdate.cart;
});
