/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react';
import {
  Switch, Route, matchPath, Redirect, useHistory, useLocation,
} from 'react-router-dom';
import TagManager from 'react-gtm-module';
import {
  Header, RemindPass, Footer, ModalsWrapperControl, PopUps, ConfirmEmail, SuccessOrder,
} from './components';
import {
  AboutUs,
  Home,
  Contacts,
  CompareProposal,
  CustomerProposal,
  Settings, Personal,
  Agreement,
  Agreement2,
  ProviderProposal,
} from './pages';
import useTypedSelector from './hooks/useTypedSelector';
import useActions from './hooks/useActions';
import Page from './layout/Page';
import getCookie from './helpers/getCookie';
import { authApi } from './api/api';
import HeaderSlider from './components/layout-components/Header/HeaderSlider';
import NotFound from './pages/NotFound/NotFound';
import LoaderCentered from './components/shared-components/Loader/LoaderCentered';
import { ModalsTypes } from './types/popUp';
import { setIsLoading } from './store/action-creators/auth';
import { store } from './store';
import CustomerTemplateProposal from './pages/CustomerTemplateProposal/CustomerTemplateProposal';
import routes from './routes';
import Logout from './pages/Logout';

const ROUTES_WITHOUT_REFRESH = [
  routes.confirmEmail,
  routes.forgetPassword,
];

function App() {
  const { getUserData, setIsFetching, setCurrentModal } = useActions();
  const {
    isAuth, isFetching, isActive,
  } = useTypedSelector((state) => state.auth);
  const { isProvider } = useTypedSelector((state) => state.userProfile);
  const { result } = useTypedSelector((state) => state.responseResult);
  const { isLoading } = useTypedSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isDataRefreshed, setIsDataRefreshed] = useState(false);

  const history = useHistory();

  const tagManagerArgs = {
    gtmId: 'GTM-PNXGJGG',
  };

  const { pathname } = useLocation();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 992) {
        setIsMobile(true);
      } else setIsMobile(false);
    }

    window.addEventListener('resize', handleResize);
  });

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);

    const token: string | undefined | null = getCookie('Authentication');
    if (token) {
      localStorage.setItem('token', token);
      getUserData(token);
      setIsDataLoaded(true);
    } else {
      if (ROUTES_WITHOUT_REFRESH.includes(pathname)) {
        return;
      }

      authApi.refresh()
        .then((res) => {
          localStorage.setItem('token', res.data.token);
          getUserData(res.data.token);
          setIsDataRefreshed(true);
        }).catch(async () => {
          store.dispatch(setIsLoading(false));
          store.dispatch(setIsFetching(false));

          try {
            await authApi.logOut();

            localStorage.clear();

            history.push(routes.index);
          } catch (e) {
            console.warn(e);
          }
        });
    }
  }, []);

  const isReadyUser = isAuth && isActive;

  if (isReadyUser && isProvider === null) {
    return (
      <Route component={LoaderCentered} />
    );
  }

  return (
    <div className="App">
      {!ROUTES_WITHOUT_REFRESH.includes(pathname) && (
        <ModalsWrapperControl />
      )}
      <PopUps />
      <Switch>
        <Route exact path={routes.index}>
          <Page
            headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
            footerComponent={<Footer />}
            children={<Home />}
          />
        </Route>
        <Route exact path={routes.about}>
          <Page
            headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
            footerComponent={<Footer />}
            children={<AboutUs />}
          />
        </Route>
        <Route exact path={routes.contacts}>
          <Page
            headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
            footerComponent={<Footer />}
            children={<Contacts />}
          />
        </Route>
        <Route exact path={routes.confirmEmail}>
          <ConfirmEmail />
        </Route>
        <Route exact path={routes.forgetPassword}>
          <RemindPass />
        </Route>
        <Route
          exact
          path={routes.logout}
          component={Logout}
        />
        <Route exact path={routes.agreement}>
          <Page
            headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
            footerComponent={<Footer />}
            children={<Agreement />}
          />
        </Route>
        <Route exact path={routes.privacyPolicy}>
          <Page
            headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
            footerComponent={<Footer />}
            children={<Agreement2 />}
          />
        </Route>

        {isReadyUser && (
          <Switch>
            <Route exact path={routes.personal}>
              <Page
                headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
                footerComponent={null}
                children={<Personal />}
              />

            </Route>
            <Route exact path={routes.settings}>
              <Page
                headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
                footerComponent={null}
                children={<Settings />}
              />
            </Route>
            {result && (
              <Route exact path={routes.success}>
                <Page
                  headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
                  footerComponent={null}
                  children={<SuccessOrder />}
                />
              </Route>
            )}
            {isProvider ? (
              <Switch>
                <Route exact path={routes.order}>
                  <Page children={<ProviderProposal isMobile={isMobile} />} />
                </Route>

                <Route exact path={routes.orderCompare}>
                  <CompareProposal isMobile={isMobile} />
                </Route>
                {isDataLoaded && <Route component={NotFound} />}
                {isLoading ? <Route component={LoaderCentered} /> : ''}
              </Switch>
            )
              : (
                <Switch>
                  <Route exact path={routes.new}>
                    <Page
                      headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
                      footerComponent={null}
                      children={<CustomerProposal />}
                    />
                  </Route>
                  <Route exact path={routes.newTemplate}>
                    <Page
                      headerComponent={!isMobile ? <Header /> : <HeaderSlider />}
                      footerComponent={null}
                      children={<CustomerTemplateProposal />}
                    />
                  </Route>
                  <Route exact path={routes.orderCompare}>
                    <CompareProposal isMobile={isMobile} />
                  </Route>
                  {isDataLoaded && <Route component={NotFound} />}
                  {isLoading ? <Route component={LoaderCentered} /> : ''}
                </Switch>
              )}
          </Switch>
        )}

        {!isAuth && !isLoading && !isFetching && (!isDataLoaded && !isDataRefreshed)
          && matchPath(pathname, { path: routes.order })
          && setCurrentModal(ModalsTypes.login) && <Redirect to={routes.index} />}

        {!isAuth && !isLoading && !isFetching && (!isDataLoaded && !isDataRefreshed)
          && matchPath(pathname, { path: routes.orderCompare })
          && setCurrentModal(ModalsTypes.login) && <Redirect to={routes.index} />}

        {!isAuth && (isDataLoaded || isDataRefreshed)
          && (!matchPath(pathname, { path: routes.orderCompare })
            && !matchPath(pathname, { path: routes.personal })
            && !matchPath(pathname, { path: routes.new })
            && !matchPath(pathname, { path: routes.order })
            && !matchPath(pathname, { path: routes.settings })
          )
          ? <Route component={NotFound} />
          : <LoaderCentered />}

        {!isAuth && (!isDataLoaded && !isDataRefreshed) && isLoading
          && <Route component={LoaderCentered} />}

      </Switch>

    </div>
  );
}

export default App;
