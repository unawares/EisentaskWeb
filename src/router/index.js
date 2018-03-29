import Vue from 'vue'
import Router from 'vue-router'

import DashboardMain from '@/pages/dashboard/Main'
import ActiveTasksView from '@/pages/dashboard/ActiveTasksView'
import CompletedTasksView from '@/pages/dashboard/CompletedTasksView'
import GroupTasksView from '@/pages/dashboard/GroupTasksView'
import ActiveGroupTasksView from '@/pages/dashboard/ActiveGroupTasksView'
import CompletedGroupTasksView from '@/pages/dashboard/CompletedGroupTasksView'
import AssignedTasksView from '@/pages/dashboard/AssignedTasksView'
import AuthenticationView from '@/pages/authentication/AuthenticationView'
import AuthenticationResetPasswordView from '@/pages/authentication/AuthenticationResetPasswordView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dashboard',
      component: DashboardMain,
      children: [
        {
          path: 'active-tasks',
          name: 'ActiveTasks',
          component: ActiveTasksView
        },
        {
          path: 'completed-tasks',
          name: 'CompletedTasks',
          component: CompletedTasksView
        },
        {
          path: 'groups/:id',
          component: GroupTasksView,
          children: [
            {
              path: 'active-tasks',
              name: 'ActiveGroupTasks',
              component: ActiveGroupTasksView
            },
            {
              path: 'completed-tasks',
              name: 'CompletedGroupTasks',
              component: CompletedGroupTasksView
            }
          ]
        },
        {
          path: 'assigned-tasks/:type',
          name: 'AssignedTasks',
          component: AssignedTasksView,
          props: true
        }
      ]
    },
    {
      path: '/auth/reset/:uid/:token',
      name: 'AuthenticationResetPassword',
      component: AuthenticationResetPasswordView,
      props: true
    },
    {
      path: '/auth/:action',
      name: 'Authentication',
      component: AuthenticationView,
      props: true
    },
    {
      path: '*',
      redirect: '/dashboard/active-tasks'
    }
  ]
})
