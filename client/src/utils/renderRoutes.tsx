import { Route } from 'react-router-dom';

export function renderRoutes(routes: any[]) {
    return routes.map(({ path, component: Component, children }, i) => (
        <Route key={i} path={path} element={<Component />}>
            {children && renderRoutes(children)}
        </Route>
    ));
}
