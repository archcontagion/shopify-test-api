export async function shopifyFetch(
  query: string,
  variables: Record<string, any> = {}
) {
  const config = useRuntimeConfig();

  const res = await $fetch(
    `https://${config.shopifyDomain}/api/2023-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.shopifyToken,
      },
      body: {
        query,
        variables,
      },
    }
  );

  if ((res as any).errors) {
    const err = (res as any).errors;
    console.error('[Shopify API]', err);
    const msg = Array.isArray(err) ? err.map((e: any) => e.message ?? e).join('; ') : JSON.stringify(err);
    throw new Error(`Shopify API error: ${msg}`);
  }

  return (res as any).data;
}
