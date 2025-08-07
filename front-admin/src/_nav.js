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
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,

  },
  {
    component: CNavItem,
    name: 'Poll Management',
    to: '/poll-management',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Vote List',
    to: '/vote-list',
    icon: <CIcon icon={cilBarcode} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Voter List',
    to: '/voter-list',
    icon: <CIcon icon={cilWc} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Results',
    to: '/results',
    icon: <CIcon icon={cilBadge} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Constituencies',
    to: '/constituencies',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Electoral Symbols',
    to: '/symbols',
    icon: <CIcon icon={cilToggleOff} customClassName="nav-icon" />,
  },
  
]

export default _nav
