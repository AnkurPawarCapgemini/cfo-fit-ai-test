import React from 'react'
import LoginFormWrapper from './style'
import useAuthLogin from '../../store/useAuthLogin';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false)
  const { login } = useAuthLogin((state) => ({ login: state.login }));
  const { err } = useAuthLogin((state) => ({ err: state.err }));
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    await login(username, password, rememberMe);

    if (!err) {
      navigate('/dashboard');
    } else {
      console.log('Login failed: ', err);
    }
  };


  return (
    <LoginFormWrapper>
      {/* <FitGpt/> */}

      <div className="row">
        <div className='col-sm-6'>
          <img src="./banner.png" alt="button"/>

        </div>
        <div className="col-sm-6">
          <div className='form-right'>
            <div className="bg-white p-4">
              <h3 className="mb-2">Please sign in</h3>
              <div className="mb-3">
                Don't have an account?
                <a href="/signup" className="link-primary ms-1">Sign up</a>
              </div>
              {err && <p style={{ color: 'red' }}>{err}</p>}
              <form className="needs-validation" onSubmit={handleSubmit} noValidate="">
                <div className="form-floating mb-3 with-leading-icon">
                  <input
                    // type="email"
                    className="form-control form-control-lg"
                    value={username}
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="userEmail">
                    Username
                    <span className="form-required">*</span>
                  </label>
                  <span className="form-floating-message-icon">
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+SWNvbi9tZWRpdW0vSWNvbl9FbWFpbDwvdGl0bGU+CiAgICA8ZyBpZD0iSWNvbi9tZWRpdW0vSWNvbl9FbWFpbCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ikljb25fRW1haWwiPgogICAgICAgICAgICA8ZyBpZD0iVHJhbnNCZyI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8ZyBpZD0iaWNvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy40OTAwMDAsIDcuMjAwMDAwKSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgeD0iMCIgeT0iOC44ODE3ODQyZS0xNiIgd2lkdGg9IjE3IiBoZWlnaHQ9IjEyIiByeD0iMSI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJQYXRoIiBwb2ludHM9IjE2LjI0IDAuNjggOC41MiA2IDAuNzYgMC42OCI+PC9wb2x5bGluZT4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
                      alt="icon"
                    />
                  </span>
                  <div className="form-floating-bottom px-3"></div>
                </div>
                <div className="form-floating mb-3 with-leading-icon">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="userPassword"
                    value={password}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="userPassword">
                    Password
                    <span className="form-required">*</span>
                  </label>
                  <span className="form-floating-message-icon">
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+SWNvbi9tZWRpdW0vSWNvbl9JbmZvPC90aXRsZT4KICAgIDxnIGlkPSJJY29uL21lZGl1bS9JY29uX0luZm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJJY29uX0luZm8iPgogICAgICAgICAgICA8ZyBpZD0iVHJhbnNCZyI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8ZyBpZD0iaWNvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy41MDAwMDAsIDMuNTAwMDAwKSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgY3g9IjguNSIgY3k9IjguNSIgcj0iOC41Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDxsaW5lIHgxPSI4LjUiIHkxPSIxMy43IiB4Mj0iOC41IiB5Mj0iNi4xMSIgaWQ9IlBhdGgiPjwvbGluZT4KICAgICAgICAgICAgICAgIDxsaW5lIHgxPSI4LjUiIHkxPSIzLjYyIiB4Mj0iOC41IiB5Mj0iMy4xMiIgaWQ9IlBhdGgiPjwvbGluZT4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
                      alt="icon"
                    />
                  </span>
                  <div className="form-floating-bottom px-3"></div>
                </div>
                <div
                  className="d-flex align-items-center justify-content-between flex-wrap"
                >
                  <div className="form-check-group mt-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        required=""
                        value=""
                      />
                      <label className="form-check-label" htmlFor="checkbox1">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-md mt-3">
                    Sign in
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cuM3cub3JnLzE5OTkveGxpbmsiPg0KICAgIDwhLS0gR2VuZXJhdG9yOiBza2V0Y2h0b29sIDYzLjEgKDEwMTAxMCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+DQogICAgPHRpdGxlPjY5QzQ3NkQ1LTYxREEtNDVCQi1CODIyLTg5RUMyRUUwOTdCNkAxLjAweDwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPg0KICAgIDxnIGlkPSJNQUNTLWNyZWF0aXZlLWRpcmVjdGlvbi1jb25jZXB0LTIiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPg0KICAgICAgICA8ZyBpZD0iWExfQ29uY2VwdC0yLURhcmtfSG9tZV9QaG90b19NZW51IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjcxLjAwMDAwMCwgLTUwNy4wMDAwMDApIiBmaWxsPSIjMTUwMTFkIiBmaWxsLXJ1bGU9Im5vbnplcm8iPg0KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAxMDYuMDAwMDAwKSI+DQogICAgICAgICAgICAgICAgPHBhdGggZD0iTTI4Ny42NzUsNDE1IEMyODcuODY2NjY3LDQxNSAyODguMDEwNDE3LDQxNC45NTE2NDEgMjg4LjEwNjI1LDQxNC44NTQ5MjIgTDI4OC4xMDYyNSw0MTQuODU0OTIyIEwyOTMuODU2MjUsNDA4LjQ3MTUwMyBDMjkzLjk1MjA4Myw0MDguMzc0Nzg0IDI5NCw0MDguMjI5NzA2IDI5NCw0MDguMDM2MjY5IEMyOTQsNDA3Ljg0MjgzMiAyOTMuOTUyMDgzLDQwNy42OTc3NTUgMjkzLjg1NjI1LDQwNy42MDEwMzYgQzI5My44MDgzMzMsNDA3LjU1MjY3NyAyOTEuODkxNjY3LDQwNS40MjQ4NyAyODguMTA2MjUsNDAxLjIxNzYxNyBDMjg3LjgxODc1LDQwMC45Mjc0NjEgMjg3LjUzMTI1LDQwMC45Mjc0NjEgMjg3LjI0Mzc1LDQwMS4yMTc2MTcgQzI4Ni45NTYyNSw0MDEuNTA3NzcyIDI4Ni45NTYyNSw0MDEuNzk3OTI3IDI4Ny4yNDM3NSw0MDIuMDg4MDgzIEwyODcuMjQzNzUsNDAyLjA4ODA4MyBMMjkyLjA1OTM3NSw0MDcuNDU1OTU5IEwyNzEuNTc1LDQwNy40NTU5NTkgQzI3MS4xOTE2NjcsNDA3LjQ1NTk1OSAyNzEsNDA3LjY0OTM5NiAyNzEsNDA4LjAzNjI2OSBDMjcxLDQwOC40MjMxNDMgMjcxLjE5MTY2Nyw0MDguNjE2NTggMjcxLjU3NSw0MDguNjE2NTggTDI3MS41NzUsNDA4LjYxNjU4IEwyOTIuMDU5Mzc1LDQwOC42MTY1OCBMMjg3LjI0Mzc1LDQxMy45ODQ0NTYgQzI4Ni45NTYyNSw0MTQuMjc0NjExIDI4Ni45NTYyNSw0MTQuNTY0NzY3IDI4Ny4yNDM3NSw0MTQuODU0OTIyIEMyODcuMzM5NTgzLDQxNC45NTE2NDEgMjg3LjQ4MzMzMyw0MTUgMjg3LjY3NSw0MTUgWiIgaWQ9ImJ1dHRvbi1tb3JlIj48L3BhdGg+DQogICAgICAgICAgICA8L2c+DQogICAgICAgIDwvZz4NCiAgICA8L2c+DQo8L3N2Zz4NCg=="
                      className="btn-icon"
                      alt="button"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </LoginFormWrapper>
  )
}

export default LoginForm