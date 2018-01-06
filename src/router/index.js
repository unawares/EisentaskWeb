import Vue from 'vue'
import Router from 'vue-router'

import ActiveTasksView from '@/assets/ActiveTasksView'
import CompletedTasksView from '@/assets/CompletedTasksView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/active-tasks',
      name: 'ActiveTasks',
      component: ActiveTasksView
    },
    {
      path: '/completed-tasks',
      name: 'CompletedTasks',
      component: CompletedTasksView
    }
  ]
})
