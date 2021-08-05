import React from 'react';
import { useAuth } from '@altrx/gundb-react-auth';
const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ './AuthenticatedApp')
);
const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'));

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <section>
      <React.Suspense fallback={<p>loading...</p>}>
        {isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </React.Suspense>
    </section>
  );
};

export default App;
