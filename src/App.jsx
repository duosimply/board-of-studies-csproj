import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="card">
        <div class="card-body">
          <h1 className='mb-3'>Login</h1>
          <form action="#">
            <div className="btn-group mb-3" role="group" aria-label="Basic radio toggle button group" >
              <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked />
              <label className="btn btn-outline-primary" for="btnradio1">Admin</label>

              <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autocomplete="off" />
              <label className="btn btn-outline-primary" for="btnradio3">User</label>
            </div>
            <div className="input-group mb-3">
              <input type="text" className="form-control" placeholder="User Email" aria-label="User Email" aria-describedby="basic-addon2" />
              <span className="input-group-text" id="basic-addon2">@kletech.ac.in</span>
            </div>
            <div className="input-group mb-3">
              <input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" />
            </div>
            <button type="button" class="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
