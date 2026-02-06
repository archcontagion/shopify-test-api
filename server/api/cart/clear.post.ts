import {shopifyFetch} from '../../utils/shopify';

const CART_GET_LINES = `
  query CartLines($cartId: ID!) {
    cart(id: $cartId) {
      id
      lines(first: 250) {
        edges { node { id } }
      }
    }
  }
`;

const CART_LINES_REMOVE = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
      userErrors {
        code
        message
        field
      }
    }
  }
`;

const emptyCart = () => ({
  id: null,
  checkoutUrl: null,
  totalQuantity: 0,
  cost: {totalAmount: {amount: '0', currencyCode: 'EUR'}},
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body?.cartId) {
    throw createError({statusCode: 400, message: 'cartId is required'});
  }
  const cartId = body.cartId as string;

  try {
    const cartData = await shopifyFetch(CART_GET_LINES, {cartId});
    const cart = cartData.cart;
    if (!cart?.lines?.edges?.length) {
      return emptyCart();
    }

    const lineIds = cart.lines.edges.map(
      (e: {node: {id: string}}) => e.node.id,
    );
    const data = await shopifyFetch(CART_LINES_REMOVE, {cartId, lineIds});
    const result = data.cartLinesRemove;

    if (result.userErrors?.length) {
      console.warn('[cart/clear] Shopify userErrors:', result.userErrors);
      return emptyCart();
    }

    return result.cart ?? emptyCart();
  } catch (e) {
    console.error('[cart/clear]', e);
    throw createError({
      statusCode: 502,
      message: 'Failed to clear cart',
      cause: e,
    });
  }
});
