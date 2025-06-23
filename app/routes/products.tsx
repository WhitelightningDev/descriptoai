import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  TextField,
  ResourceList,
  ResourceItem,
  Avatar,
  Text,
  BlockStack,
  EmptyState,
} from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import { authenticate } from "app/shopify.server";

// --- Loader ---
export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const search = url.searchParams.get("q") || "";

  const query = `
    query getProducts($first: Int!, $query: String) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            vendor
            handle
            tags
          }
        }
      }
    }
  `;

  const response = await admin.graphql(query, {
    variables: {
      first: 20,
      query: search.length ? search : null,
    },
  });

  const result = await response.json();

  if (!result?.data?.products?.edges) {
    throw new Error("Failed to fetch products from Shopify Admin API");
  }

  const products = result.data.products.edges.map((edge: any) => edge.node);
  return json({ products });
}

// --- Component ---
export default function ProductListPage() {
  const { products } = useLoaderData<typeof loader>();
  const [search, setSearch] = useState("");

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Select a Product" fullWidth>
        <Card padding="400">
          <BlockStack gap="400">
            {/* Search Field */}
            <div>
              <TextField
                label="Search products"
                value={search}
                onChange={setSearch}
                autoComplete="off"
                placeholder="Search by product name or vendor"
              />
            </div>

            {/* Product List */}
            <div>
              {products.length > 0 ? (
                <ResourceList
                  resourceName={{ singular: "product", plural: "products" }}
                  items={products}
                  renderItem={(product) => {
                    const { id, title, vendor } = product;
                    const media = <Avatar customer size="md" name={title} />;

                    return (
                      <ResourceItem
                        id={id}
                        media={media}
                        accessibilityLabel={`View details for ${title}`}
                        onClick={() => console.log(`Clicked ${title}`)}
                      >
                        <BlockStack gap="050">
                          <Text as="span" variant="bodyMd" fontWeight="bold">
                            {title}
                          </Text>
                          <Text as="span" variant="bodySm" tone="subdued">
                            Vendor: {vendor}
                          </Text>
                        </BlockStack>
                      </ResourceItem>
                    );
                  }}
                />
              ) : (
                <EmptyState
                  heading="No products found"
                  action={{
                    content: "Create Product",
                    onAction: () =>
                      window.open(
                        "https://admin.shopify.com/store/YOUR_STORE/products/new",
                        "_blank",
                      ),
                  }}
                  image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                >
                  <p>
                    Try a different search term or create a new product to get
                    started.
                  </p>
                </EmptyState>
              )}
            </div>
          </BlockStack>
        </Card>
      </Page>
    </AppProvider>
  );
}
