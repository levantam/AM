import { GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  notificationProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import './styles/app.css';

import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { DevToolList, DevToolShow } from "./pages/dev-tools";
import { CodeOutlined } from "@ant-design/icons";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            notificationProvider={notificationProvider}
            i18nProvider={i18nProvider}
            routerProvider={routerBindings}
            resources={[
              // {
              //   name: "blog_posts",
              //   list: "/blog-posts",
              //   create: "/blog-posts/create",
              //   edit: "/blog-posts/edit/:id",
              //   show: "/blog-posts/show/:id",
              //   meta: {
              //     canDelete: true,
              //   },
              // },
              // {
              //   name: "categories",
              //   list: "/categories",
              //   create: "/categories/create",
              //   edit: "/categories/edit/:id",
              //   show: "/categories/show/:id",
              //   meta: {
              //     canDelete: true,
              //   },
              // },
              {
                name: "dev_tools",
                list: "/dev-tools",
                show: "/dev/show/:id",
                meta: {
                  canDelete: true,
                  icon: <CodeOutlined /> 
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <ThemedLayoutV2
                    Header={() => <Header sticky />}
                    Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                    Title={({ collapsed }) => (
                      <ThemedTitleV2
                        collapsed={collapsed}
                        text="1Tools"
                        icon={<AppIcon />}
                      />
                    )}
                  >
                    <Outlet />
                  </ThemedLayoutV2>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="blog_posts" />}
                />
                {/* <Route path="/blog-posts">
                  <Route index element={<BlogPostList />} />
                  <Route path="create" element={<BlogPostCreate />} />
                  <Route path="edit/:id" element={<BlogPostEdit />} />
                  <Route path="show/:id" element={<BlogPostShow />} />
                </Route>
                <Route path="/categories">
                  <Route index element={<CategoryList />} />
                  <Route path="create" element={<CategoryCreate />} />
                  <Route path="edit/:id" element={<CategoryEdit />} />
                  <Route path="show/:id" element={<CategoryShow />} />
                </Route> */}
                <Route path="/dev-tools">
                  <Route index element={<DevToolList />} />
                  <Route path="show/:id" element={<DevToolShow />} />
                </Route>
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
