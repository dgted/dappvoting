import CIcon from '@coreui/icons-react'
import {
  cilCalculator,
  cilSpeedometer,
  cilAddressBook,
  cilWc,
  cilToggleOff,
  cilTask,
  cilAccountLogout,
  cilBadge,
  cilBarcode

} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,

  }
]

export default _nav
