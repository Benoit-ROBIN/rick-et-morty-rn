import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { CharacterActionTypes } from './types'
import { fetchError, fetchSuccess } from './actions'
import { Api } from '../../api/api';

function* handleFetch() {
  try {
    // To call async functions, use redux-saga's `call()`.
    const api = new Api
    const res = yield call(api.getCharacters)
    const { data } = res

    if (res.error) {
      yield put(fetchError(res.error))
    } else {
        yield put(fetchSuccess(data))
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(fetchError(err.stack!))
    } else {
      yield put(fetchError('An unknown error occured.'))
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchFetchRequest() {
  yield takeEvery(CharacterActionTypes.FETCH_REQUEST, handleFetch)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* characterSaga() {
  yield all([fork(watchFetchRequest)])
}

export default characterSaga
