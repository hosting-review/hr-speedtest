import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import {createLogger} from 'redux-logger';
//import createHistory from 'history/createBrowserHistory';
//import {routerMiddleware} from 'react-router-redux';
//import * as storage from 'redux-storage';
//import createEngine from 'redux-storage-engine-localstorage';
import combinedReducers from './reducers';

const //engine = createEngine('56a89czxc987q49wdxc'),
    //middleware = createMiddleware(engine),
    //history = createHistory(),
    appliedMiddleware = (!process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development') ?
        applyMiddleware(thunk, /*middleware, */promise(), createLogger()) :
        applyMiddleware(thunk, /*middleware, */promise()),
    store = createStore(combinedReducers, appliedMiddleware);

/*const load = storage.createLoader(engine);
load(store);*/

//export {engine};
export default store;
