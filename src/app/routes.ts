import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Homepage } from "./components/Homepage";
import { Terminal } from "./components/Terminal";
import { Missions } from "./components/Missions";
import { Constellation } from "./components/Constellation";
import { Launches } from "./components/Launches";
import { IntelFeed } from "./components/IntelFeed";
import { MissionControl } from "./components/MissionControl";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Homepage },
      { path: "terminal", Component: Terminal },
      { path: "missions", Component: Missions },
      { path: "constellation", Component: Constellation },
      { path: "launches", Component: Launches },
      { path: "intel", Component: IntelFeed },
      { path: "mission-control/:id", Component: MissionControl },
    ],
  },
]);
