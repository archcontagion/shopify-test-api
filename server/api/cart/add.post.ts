import {shopifyFetch} from '../../utils/shopify';

const CART_ADD = `
  mutation CartAdd($cartId: ID!, $variantId: ID!) {
    cartLinesAdd(
      cartId: $cartId
      lines: [{ merchandiseId: $variantId, quantity: 1 }]
    ) {
      cart {
        id
        checkoutUrl
        totalQuantity
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

  const data = await shopifyFetch(CART_ADD, {
    cartId: body.cartId,
    variantId: body.variantId,
  });

  return data.cartLinesAdd.cart;
});
