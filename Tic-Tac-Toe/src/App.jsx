import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from "react-router-dom"
import RootLayout from "./layout/RootLayout"
import {GameBoardPage,GameOptionsPage} from "./Page"
import SocketProvider from "./context/SocketProvider"

function App(){
  const router=createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<RootLayout></RootLayout>}>
    <Route path="/" element={<GameOptionsPage></GameOptionsPage>}></Route>
    <Route path="/board" element={<GameBoardPage></GameBoardPage>}></Route>
  </Route>))

  return(
    <SocketProvider>
      <RouterProvider router={router}>
      </RouterProvider>
    </SocketProvider>
  )
}

export default App