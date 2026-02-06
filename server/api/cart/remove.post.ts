import {shopifyFetch} from '../../utils/shopify';

const CART_REMOVE = `
  mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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

  const data = await shopifyFetch(CART_REMOVE, {
    cartId: body.cartId,
    lineIds: body.lineIds,
  });

  return data.cartLinesRemove.cart;
});
