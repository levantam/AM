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
import { BrowserRouter, Outlet, Route, Routes, HashRouter } from "react-router-dom";
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
import { CodeOutlined, DotChartOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { AboutPage } from "./pages/about";
import { HrToolList, HrToolShow } from "./pages/hr-tools";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup, faCode, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { ToolShow } from "./pages/tool-show";
import { Dashboard } from "./pages/dashboard";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <HashRouter>
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
                show: "/dev-tools/show/:id",
                meta: {
                  canDelete: true,
                  icon: <FontAwesomeIcon icon={faCode} />
                },
              },
              {
                name: "HR_tools",
                list: "/hr-tools",
                show: "/hr-tools/show/:id",
                meta: {
                  canDelete: true,
                  icon: <FontAwesomeIcon icon={faUserGroup} />
                },
              },
              {
                name: "about",
                list: "/about",
                meta: {
                  canDelete: true,
                  icon: <FontAwesomeIcon icon={faCircleInfo} />
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
                {/* <Route
                  index
                  element={<NavigateToResource resource="blog_posts" />}
                /> */}
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
                <Route path="/">
                  <Route index element={<Dashboard />} />
                </Route>
                <Route path="/dev-tools">
                  <Route index element={<DevToolList />} />
                  <Route path="show/:id" element={<ToolShow />} />
                </Route>
                <Route path="/hr-tools">
                  <Route index element={<HrToolList />} />
                  <Route path="show/:id" element={<ToolShow />} />
                </Route>
                <Route path="/about">
                  <Route index element={<AboutPage />} />
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
    </HashRouter>
  );
}

export default App;
