import { createBrowserRouter, RouterProvider } from "react-router"

import { Layout } from "@/components/site/layout"
import Application from "@/pages/application"
import AskAi from "@/pages/ask-ai"
import Assistant from "@/pages/assistant"
import { CollectionPage, Collections } from "@/pages/collections"
import { Companies, CompanyPage } from "@/pages/companies"
import Employers from "@/pages/employers"
import { Newsletter, NotFound, SubmitCompany } from "@/pages/forms"
import Home from "@/pages/home"
import { JobPage, Jobs, LocationJobs, RoleJobs } from "@/pages/jobs"
import Match from "@/pages/match"
import Salary from "@/pages/salary"
import Saved from "@/pages/saved"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/jobs/:id", element: <JobPage /> },
      { path: "/roles/:role", element: <RoleJobs /> },
      { path: "/roles/:role/:location", element: <RoleJobs /> },
      { path: "/locations/:slug", element: <LocationJobs /> },
      { path: "/companies", element: <Companies /> },
      { path: "/companies/:id", element: <CompanyPage /> },
      { path: "/collections", element: <Collections /> },
      { path: "/collection/:slug", element: <CollectionPage /> },
      { path: "/saved", element: <Saved /> },
      { path: "/ai", element: <AskAi /> },
      { path: "/ai-assistant", element: <Assistant /> },
      { path: "/match", element: <Match /> },
      { path: "/application-tool", element: <Application /> },
      { path: "/salary", element: <Salary /> },
      { path: "/employers", element: <Employers /> },
      { path: "/pricing", element: <Employers /> },
      { path: "/newsletter", element: <Newsletter /> },
      { path: "/submit-company", element: <SubmitCompany /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
