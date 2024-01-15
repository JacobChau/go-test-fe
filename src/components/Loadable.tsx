import { Suspense, FunctionComponent, PropsWithChildren } from 'react';

// project import
import Loader from './Loader/Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component: FunctionComponent<PropsWithChildren<{}>>) => (props: PropsWithChildren<{}>) =>
    (
        <Suspense fallback={<Loader />}>
            <Component {...props} />
        </Suspense>
    );

export default Loadable;
