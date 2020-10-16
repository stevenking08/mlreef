import ProjectsView from 'components/myProjects/myProjects';
import LoginView from 'components/login/login';
import RegisterView from 'components/RegisterView';
import ResetPasswordView from 'components/views/ResetPassword/ResetPasswordView';
import PasswordConfirmationView from 'components/views/ResetPassword/PasswordConfirmationView';
import ErrorView from 'components/error-page/errorPage';
import ExploreView from 'components/views/ExploreView';
import RegisterLandingView from 'components/RegisterView/RegisterLandingView';
import GroupsOverview from 'components/views/groupsOverview';
import GroupsView from 'components/views/MlreefGroups/GroupView';
import UserAccountView from 'components/views/userSettings/UserAccount';
import ProfileView from 'components/userProfile/userProfile';
import ProjectView from 'components/projectView/projectView';
import CreateProjectView from 'components/views/create-project/createProject';
import BranchesView from 'components/branches-list-view/branchesView';
import NewBranchView from 'components/views/NewBranch';
import MergeRequestsView from 'components/new-merge-request/merge-request-overview';
import NewMergeRequestView from 'components/new-merge-request/newMergeRequest';
import DataInstancesView from 'components/data-instance/dataInstanceOverview';
import DataInstanceDetailsView from 'components/data-instance/dataInstanceDetails';
import ExperimentsView from 'components/experiments-overview/ExperimentOverview';
import ExperimentDetailsView from 'components/experiment-details/experimentDetails';
import PipelinesExecutionView from 'components/views/PipelinesExecutionView';
import VisualizationsView from 'components/data-visualization/dataVisualizationOverview';
import VisualizationDetailView from 'components/data-visualization/dataVisualizationDetail';
import FileView from 'components/fileView/fileView';
import SettingsView from 'components/views/SettingsView';
import CreateGroupView from 'components/views/create-group/createGroup';
import CommitsView from 'components/commits-view/commitsView';
import InsightsView from 'components/insights/insights';
import UploadFileView from 'components/views/uploadFile/uploadFile';
import CommitDetailsView from 'components/commits-details/commitDetails';
import ForkView from 'components/ForkView';
import PublishingView from 'components/views/PublishingView';
import PublishProcessView from 'components/views/PublishProcessView';
import Error404View from 'components/error-page/error404Page';

// this is component for testing layout and should be removed after alpha
import DemoView from 'components/Demo';
import DetailedRepositoryView from 'components/views/DetailedRepositoryView';
import BasicMergeRequestView from './components/mergeRequestDetailView/basicMergeRequestView';

export default [
  {
    name: 'home',
    path: '/',
    exact: true,
    component: ProjectsView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'notFound',
    path: '/not-found/:info?',
    component: Error404View,
  },
  {
    name: 'error',
    path: '/error-page',
    component: ErrorView,
  },
  {
    name: 'demo',
    path: '/demo',
    exact: true,
    component: DemoView,
  },
  // login and register routes
  {
    name: 'login',
    path: '/login',
    component: LoginView,
  },
  {
    name: 'register',
    path: '/register',
    component: RegisterView,
  },
  {
    name: 'passwordReset',
    path: '/user/reset-password',
    component: ResetPasswordView,
  },
  {
    name: 'passwordConfirmation',
    path: '/login/password-reset/:token',
    component: PasswordConfirmationView,
  },
  {
    name: 'welcome',
    path: '/welcome',
    component: RegisterLandingView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'explore',
    path: '/explore',
    component: ExploreView,
  },
  {
    name: 'groups',
    path: '/groups',
    exact: true,
    component: GroupsOverview,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'groupsOverview',
    path: '/groups/:groupPath',
    exact: true,
    component: GroupsView,
  },
  {
    name: 'newGroup',
    path: '/groups/new',
    exact: true,
    component: CreateGroupView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'userProfile',
    path: '/profile',
    component: UserAccountView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'profile',
    path: '/:user',
    exact: true,
    component: ProfileView,
  },
  // project view section
  {
    name: 'project',
    path: '/:namespace/:slug',
    exact: true,
    component: ProjectView,
  },
  {
    name: 'projectSettings',
    path: '/:namespace/:slug/-/settings',
    exact: true,
    component: SettingsView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'projectBranchFolder',
    path: '/:namespace/:slug/-/tree/:branch/:path(.+)',
    component: ProjectView,
  },
  {
    name: 'projectBranch',
    path: '/:namespace/:slug/-/tree/:branch',
    component: ProjectView,
  },
  {
    name: 'createProject',
    path: '/new-project/classification/:classification/:groupNamespace?',
    exact: true,
    component: CreateProjectView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'fork',
    path: '/my-projects/:projectId/fork',
    component: ForkView,
    exact: true,
    meta: {
      authRequired: true,
    },
  },
  // branch list and create
  {
    name: 'branches',
    path: '/:namespace/:slug/-/branches',
    exact: true,
    component: BranchesView,
  },
  {
    name: 'newBranch',
    path: '/:namespace/:slug/-/branches/new',
    component: NewBranchView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'branchCommits',
    path: '/my-projects/:projectId/:branch/commits/:pathParam?',
    component: CommitsView,
    exact: true,
  },
  // files
  {
    name: 'fileCommit',
    path: '/:namespace/:slug/-/blob/commit/:commit/path/:file(.+)',
    exact: true,
    component: FileView,
  },
  {
    name: 'fileBranch',
    path: '/:namespace/:slug/-/blob/branch/:branch(.+)/path/:file(.+)',
    component: FileView,
  },
  {
    name: 'uploadFile',
    path: '/my-projects/:projectId/upload-file',
    component: UploadFileView,
    exact: true,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'uploadFileBranch',
    path: '/my-projects/:projectId/:branch(.+)/upload-file',
    component: UploadFileView,
    exact: true,
    meta: {
      authRequired: true,
    },
  },
  // Merge Request view section
  {
    name: 'mergeRequests',
    path: '/:namespace/:slug/-/merge_requests',
    exact: true,
    component: MergeRequestsView,
  },
  {
    name: 'newMergeRequest',
    // for compatibility with git cli
    path: '/:namespace/:slug/(-/|)merge_requests/new',
    component: NewMergeRequestView,
    exact: true,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'basicMergeRequest',
    path: '/:namespace/:slug/-/merge_requests/:iid',
    component: BasicMergeRequestView,
  },
  {
    name: 'datasets',
    path: '/:namespace/:slug/-/datasets',
    exact: true,
    component: DataInstancesView,
  },
  {
    name: 'newDataset',
    path: '/:namespace/:slug/-/datasets/new',
    component: PipelinesExecutionView,
    exact: true,
    meta: {
      authRequired: true,
      newDataset: true,
    },
  },
  {
    name: 'dataset',
    path: '/:namespace/:slug/-/datasets/:dataId',
    exact: true,
    component: DataInstanceDetailsView,
  },
  {
    name: 'datasetBranchPath',
    path: '/:namespace/:slug/-/datasets/:branch/:dataId/path/:path',
    component: DataInstanceDetailsView,
  },
  {
    name: 'experiments',
    path: '/:namespace/:slug/-/experiments',
    component: ExperimentsView,
    exact: true,
  },
  {
    name: 'newExperiment',
    path: '/:namespace/:slug/-/experiments/new',
    component: PipelinesExecutionView,
    exact: true,
    meta: {
      authRequired: true,
      newExperiment: true,
    },
  },
  {
    name: 'experiment',
    path: '/:namespace/:slug/-/experiments/:experimentId',
    component: ExperimentDetailsView,
    meta: {
      authRequired: true,
    },
  },

  {
    name: 'visualizations',
    path: '/:namespace/:slug/-/visualizations',
    component: VisualizationsView,
    exact: true,
  },
  {
    name: 'newVisualizations',
    path: '/:namespace/:slug/-/visualizations/new',
    component: PipelinesExecutionView,
    exact: true,
    meta: {
      authRequired: true,
      newVisualization: true,
    },
  },
  {
    name: 'visualization',
    path: '/:namespace/:slug/-/visualizations/:visId',
    component: VisualizationDetailView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'visualizationBranch',
    path: '/:namespace/:slug/-/visualizations/:visId/path/:path',
    component: VisualizationDetailView,
    meta: {
      authRequired: true,
    },
  },
  // insights
  {
    name: 'insightJob',
    path: '/:namespace/:slug/insights/-/jobs/:logId',
    component: InsightsView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'insights',
    path: '/:namespace/:slug/insights/-/jobs',
    component: InsightsView,
    exact: true,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'commitDetails',
    path: '/my-projects/:projectId/commit/:commitId',
    component: CommitDetailsView,
    exact: true,
  },
  // publishing
  {
    name: 'publishing',
    path: '/:namespace/:slug/-/publishing',
    component: PublishingView,
    exact: true,
    meta: {
      authRequired: false,
    },
  },
  {
    name: 'publishingProcess',
    path: '/:namespace/:slug/-/publishing/process',
    component: PublishProcessView,
    exact: true,
    meta: {
      authRequired: false,
    },
  },
  {
    name: 'detailed-view-1',
    path: '/:namespace/:slug/-/repository/tree/-/branch/:branch/path/:path',
    component: DetailedRepositoryView,
    exact: true,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'detailed-view-2',
    path: '/:namespace/:slug/-/repository/tree/-/commit/:commit/path/:path',
    component: DetailedRepositoryView,
    exact: true,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'detailed-view-3',
    path: '/:namespace/:slug/-/repository/tree/-/commit/:commit',
    component: DetailedRepositoryView,
    meta: {
      authRequired: true,
    },
  },
  {
    name: 'empty',
    path: '',
    component: Error404View,
  },
];