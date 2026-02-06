import {shopifyFetch} from '../utils/shopify';

const PRODUCTS_QUERY = `
  query Products {
    products(first: 12) {
      edges {
        node {
          id
          title
          handle
          description
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
`;

export default defineEventHandler(async () => {
  const data = await shopifyFetch(PRODUCTS_QUERY);
  return data.products.edges.map((e: any) => e.node);
});
