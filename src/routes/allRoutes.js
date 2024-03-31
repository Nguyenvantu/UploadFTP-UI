import Login from "../pages/Authentication/Login";
import UploadPicture from "../pages/UploadPicture/Capturev1";
import UploadPicture2 from "../pages/UploadPicture/Capture";
import Camera from "../pages/UploadPicture/Camera";
import ContainerList from "../pages/Container/ContainerList";
import Container from "../pages/Container/ContainerDetail";
import UserList from "../pages/User/List";
import User from "../pages/User/Detail";
import DeleteData from "../pages/DeleteData";

const userRoutes = [
  { path: "/container", exact: true, component: ContainerList },
  { path: "/container/:id", component: Container },
  { path: "/user", exact: true, component: UserList },
  { path: "/user/:id", exact: true, component: User },
  { path: "/deleteData", exact: true, component: DeleteData },
  { path: "/v1", component: UploadPicture },
  { path: "/", component: UploadPicture2 },
  { path: "/camera", component: Camera },
];

const authRoutes = [{ path: "/login", component: Login }];

export { userRoutes, authRoutes };
