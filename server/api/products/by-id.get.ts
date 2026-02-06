import {shopifyFetch} from '../../utils/shopify';

const SHOPIFY_PRODUCT_GID_PREFIX = 'gid://shopify/Product/';

const PRODUCT_BY_ID_QUERY = `
  query ProductById($id: ID!) {
    product(id: $id) {
      id
      title
      handle
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
            image {
              url
              altText
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
  const idParam = getQuery(event).id;
  if (!idParam || typeof idParam !== 'string') {
    throw createError({statusCode: 400, message: 'id query is required'});
  }

  const id = idParam.startsWith('gid://')
    ? idParam
    : `${SHOPIFY_PRODUCT_GID_PREFIX}${idParam}`;

  try {
    const data = await shopifyFetch(PRODUCT_BY_ID_QUERY, {id});
    const product = data.product;

    if (!product) {
      throw createError({statusCode: 404, message: 'Product not found'});
    }

    return product;
  } catch (e) {
    if (e && typeof e === 'object' && 'statusCode' in e) throw e;
    console.error('[products/by-id]', e);
    throw createError({
      statusCode: 502,
      message: 'Failed to fetch product',
      cause: e,
    });
  }
});
