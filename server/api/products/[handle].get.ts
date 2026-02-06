import {shopifyFetch} from '../../utils/shopify';

const PRODUCT_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
          }
        }
      }
      seo {
        title
        description
      }
    }
  }
`;

export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, 'handle') as string;

  const data = await shopifyFetch(PRODUCT_QUERY, {handle});

  if (!data.productByHandle) {
    throw createError({statusCode: 404});
  }

  return data.productByHandle;
});
