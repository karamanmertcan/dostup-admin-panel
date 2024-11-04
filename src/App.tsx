import {
  GitHubBanner,
  Refine,
  type AuthProvider,
  Authenticated,
  Link,
} from "@refinedev/core";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
  AuthPage,
  RefineThemes,
  ThemedSiderV2,
} from "@refinedev/antd";
import {
  GoogleOutlined,
  GithubOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

import dataProvider from "@refinedev/simple-rest";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { App as AntdApp, ConfigProvider, Layout } from "antd";

import "@refinedev/antd/dist/reset.css";

import { PostList, PostEdit, PostShow, BlogsCreate } from "../src/pages/posts";
import { DashboardPage } from "../src/pages/dashboard";
import { NewsCreate, NewsEdit, NewsList, NewsShow } from "./pages/news";
import { ListingsCreate, ListingsEdit, ListingsList } from "./pages/listings";
import { ListingTypeCreate, ListingTypeList } from "./pages/listing-type";

const API_URL = "http://localhost:3003";

/**
 *  mock auth credentials to simulate authentication
 */
const authCredentials = {
  email: "demo@refine.dev",
  password: "demodemo",
};

const App: React.FC = () => {
  const authProvider: AuthProvider = {
    login: async ({ providerName, email }) => {
      if (email === authCredentials.email) {
        localStorage.setItem("email", email);
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password",
        },
      };
    },
    register: async (params) => {
      if (params.email === authCredentials.email && params.password) {
        localStorage.setItem("email", params.email);
        return {
          success: true,
          redirectTo: "/",
        };
      }
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      };
    },


    logout: async () => {
      localStorage.removeItem("email");
      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return { error };
    },
    check: async () =>
      localStorage.getItem("email")
        ? {
          authenticated: true,
        }
        : {
          authenticated: false,
          error: {
            message: "Check failed",
            name: "Not authenticated",
          },
          logout: true,
          redirectTo: "/login",
        },
    getPermissions: async (params) => params?.permissions,
    getIdentity: async () => ({
      id: 1,
      name: "Admin",
      avatar:
        "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
    }),
  };

  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider(API_URL)}
            routerProvider={routerProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <DashboardOutlined />,
                },
              },
              {
                name: "blogs",
                list: "/blogs",
                create: "/blogs/create",
                show: "/blogs/show/:id",
                edit: "/blogs/blog/:id",
              },
              {
                name: "news",
                list: "/news",
                create: "/news/create",
                show: "/news/show/:id",
                edit: "/news/news-by-id/:id",
              },
              {
                name: "listings",
                list: "/listings",
                create: "/listings/create",
                show: "/listings/show/:id",
                edit: "/listings/listings-by-id/:id",
              },
              {
                name: "listing-types",
                list: "/listing-types",
                create: "/listing-types/create",
              },
            ]}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2
                      Sider={(props) => (
                        <ThemedSiderV2
                          Title={({ }) => (
                            <span
                              style={{
                                fontSize: 27,
                                fontWeight: 'bold',
                              }}
                            >
                              DOSTUP
                            </span>
                          )}
                        />
                      )}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />

                <Route path="/blogs">
                  <Route index element={<PostList />} />
                  <Route path="blog/:id" element={<PostEdit />} />
                  <Route path="show/:id" element={<PostShow />} />
                  <Route path="create" element={<BlogsCreate />} />
                </Route>
                <Route path="/news">
                  <Route index element={<NewsList />} />
                  <Route path="news-by-id/:id" element={<NewsEdit />} />
                  <Route path="show/:id" element={<NewsShow />} />
                  <Route path="create" element={<NewsCreate />} />
                </Route>
                <Route path="/listings">
                  <Route index element={<ListingsList />} />
                  <Route path="listings-by-id/:id" element={<ListingsEdit />} />
                  <Route path="show/:id" element={<NewsShow />} />
                  <Route path="create" element={<ListingsCreate />} />
                </Route>
                <Route path="/listing-types">
                  <Route index element={<ListingTypeList />} />
                  <Route path="create" element={<ListingTypeCreate />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="posts" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      forgotPasswordLink={false}
                      registerLink={false}
                      formProps={{
                        initialValues: {
                          ...authCredentials,
                        },
                      }}
                    />
                  }
                />

              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
