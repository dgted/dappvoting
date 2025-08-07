import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      
      <div className="ms-auto">
        <span className="me-1">Copyright &copy;</span>
        <a href="https://ku.ac.bd/" target="_blank" rel="ku">
          2025 Khulna University.
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
