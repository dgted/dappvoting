import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))


const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const PollList = React.lazy(() => import('./views/pages/PollManagement/PollList'));

const Results = React.lazy(() => import('./views/pages/Results/Results'));


const Constituencies = React.lazy(() => import('./views/pages/Constituencies/Constituencies'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/poll-management', name: 'Poll Management', element: PollList },
  { path: '/results', name: 'Results', element: Results },

    { path: '/results', name: 'Results', element: Results },

  { path: '/constituencies', name: 'Constituencies', element: Constituencies },

  { path: '/voter-list', name: 'Voter List', element: React.lazy(() => import('./views/pages/VoterList/VoterList')) },
  { path: '/symbols', name: 'Symbols', element: React.lazy(() => import('./views/pages/Symbols/Symbols')) },

  {path: '/vote-list', name: 'List of Vote', element: React.lazy(() => import('./views/pages/VoteList/VoteList')) },







]

export default routes
