import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/HomePage.vue'
import Accounts from '../views/AccountsPage.vue'
import Transactions from '../views/TransactionsPage.vue'
import Reports from '../views/ReportsPage.vue'
import Lab from '../views/LabPage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/accounts', name: 'Accounts', component: Accounts },
  { path: '/transactions', name: 'Transactions', component: Transactions },
  { path: '/reports', name: 'Reports', component: Reports },
  { path: '/lab', name: 'Lab', component: Lab },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router