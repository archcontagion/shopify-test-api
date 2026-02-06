import {shopifyFetch} from '../../utils/shopify';

const CART_CREATE = `
  mutation {
    cartCreate {
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

export default defineEventHandler(async () => {
  const data = await shopifyFetch(CART_CREATE);
  return data.cartCreate.cart;
});
