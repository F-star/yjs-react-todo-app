import ReactDOM from 'react-dom/client';
import './index.css';
import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from 'react-router-dom';
import { JoinRoomView } from './views/join-room-view.tsx';
import { RoomView } from './views/room-view.tsx';

const router = createBrowserRouter([
  {
    path: '/join/room',
    element: <JoinRoomView />,
  },
  {
    path: '/room/:roomId',
    element: <RoomView />,
  },
  {
    path: '*',
    element: <Navigate to="/join/room" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />,
);
