import {shopifyFetch} from '../../utils/shopify';

const CART_QUERY = `
  query CartGet($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
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
    }
  }
`;

export default defineEventHandler(async (event) => {
  const cartId = getQuery(event).cartId;
  if (!cartId || typeof cartId !== 'string') {
    throw createError({statusCode: 400, message: 'cartId query is required'});
  }

  try {
    const data = await shopifyFetch(CART_QUERY, {cartId: cartId as string});
    const cart = data.cart;
    if (!cart) {
      return null;
    }
    return cart;
  } catch (e) {
    console.error('[cart/get]', e);
    throw createError({
      statusCode: 502,
      message: 'Failed to fetch cart',
      cause: e,
    });
  }
});
