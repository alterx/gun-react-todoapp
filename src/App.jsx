import { lazy, Suspense } from 'react';
import { useAuth, AuthProvider } from '@altrx/gundb-react-hooks';
import { Gun, SEA } from '@gun-vue/gun-es';

const AuthenticatedApp = lazy(() =>
  import(/* webpackPrefetch: true */ './AuthenticatedApp')
);

const AuthedApp = () => {
  const { user, isLoggedIn, login } = useAuth();

  return (
    <div className="app">
      {!isLoggedIn && (
        <div className="todoapp" id="splash">
          <h1 id="appName">TODOs App</h1>
          <button
            className="new-list"
            onClick={(e) => {
              //getApp('new');
              login();
            }}
          >
            New user
          </button>
        </div>
      )}
      {isLoggedIn && user && <AuthenticatedApp />}
    </div>
  );
};

const App = () => {
  return (
    <section>
      <Suspense fallback={<p>loading...</p>}>
        <AuthProvider
          Gun={Gun}
          sea={SEA}
          storage={localStorage}
          gunOpts={{
            peers: ['http://localhost:8765/gun'],
            localStorage: false,
          }}
        >
          <AuthedApp />
        </AuthProvider>
      </Suspense>
    </section>
  );
};

export default App;
