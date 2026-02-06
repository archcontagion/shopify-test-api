import {shopifyFetch} from '../../utils/shopify';

// Storefront API: collection(id: ID) — https://shopify.dev/docs/api/storefront/latest/queries/collection
// GID format: gid://shopify/Collection/{numericId}
const SHOPIFY_COLLECTION_GID_PREFIX = 'gid://shopify/Collection/';

const COLLECTION_BY_ID_QUERY = `
  query CollectionById($id: ID!) {
    collection(id: $id) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: 24) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
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
  const idParam = getQuery(event).id;
  if (!idParam || typeof idParam !== 'string') {
    throw createError({ statusCode: 400, message: 'id query is required' });
  }

  // Accept only the number; build GID in code (e.g. 6347204529479)
  const numericId = idParam.replace(/^gid:\/\/shopify\/Collection\//i, '').trim();
  if (!numericId) {
    throw createError({ statusCode: 400, message: 'id must be a collection ID number' });
  }
  const id = `${SHOPIFY_COLLECTION_GID_PREFIX}${numericId}`;

  try {
    const data = await shopifyFetch(COLLECTION_BY_ID_QUERY, { id });
    const collection = data.collection;

    if (!collection) {
      throw createError({ statusCode: 404, message: 'Collection not found' });
    }

    return collection;
  } catch (e) {
    if (e && typeof e === 'object' && 'statusCode' in e) throw e;
    console.error('[collections/by-id]', e);
    throw createError({
      statusCode: 502,
      message: 'Failed to fetch collection',
      cause: e,
    });
  }
});
