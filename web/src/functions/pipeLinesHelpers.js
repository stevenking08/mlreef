import { toastr } from 'react-redux-toastr';
import ExperimentsApi from 'apis/experimentApi';
import {
  Adjectives,
  BOOL,
  CANCELED,
  EXPIRED,
  FAILED,
  Nouns,
  PENDING,
  RUNNING,
  SKIPPED,
  SUCCESS,
} from '../dataTypes';

/**
 * @param {input}: input html element which must be highlited to the user as wrong
 * @param {inputDataModel}: data model of input(data type, required, etc)
 * @param {dataOperationsHtmlElm}: operation container which must be highligthed
 */
export const showErrorsInTheOperationsSelected = (input, inputDataModel, dataOperationsHtmlElm) => {
  input.style.border = '1px solid red';
  dataOperationsHtmlElm.style.border = '1px solid red';
  const errorDiv = document.getElementById(`error-div-for-${input.id}`);
  errorDiv.style.display = 'flex';

  input.addEventListener('focusout', () => {
    input.removeAttribute('style');
    errorDiv.style.display = 'none';
  });

  dataOperationsHtmlElm.addEventListener('focusout', () => {
    dataOperationsHtmlElm.removeAttribute('style');
  });

  if (inputDataModel.dataType === BOOL) {
    const dropDown = input.parentNode.childNodes[1];
    dropDown.style.border = '1px solid red';
    dropDown.addEventListener('focusout', () => {
      dropDown.removeAttribute('style');
    });
  }
};

/* ----------------------------  ----------------------------------  -------------------------------*/

/**
 * 
 * @param {*} dataOperationsSelected: opeartions selected by user to  be executed on data
 * @param {*} backendId: backend project id is the id that backend assign to a gitlab project
 * @param {*} branchName: new branch name that will contain the output
 * @param {*} branchSelected: gitlab branch in which files will be read
 * @param {*} filesSelectedInModal: files that will be used as input for models or operations
 */
const createExperimentInProject = (
  dataOperationsSelected,
  backendId,
  branchName,
  branchSelected,
  filesSelectedInModal,
) => {
  const experimentData = dataOperationsSelected[0];
  const { inputValuesAndDataModels: parameters, slug } = experimentData;
  const experimentBody = {
    slug: branchName, // slug is NOT the branch name, it needs replacement
    name: branchName,
    source_branch: branchSelected,
    target_branch: branchName,
    input_files: filesSelectedInModal.map((file) => file.path),
    processing: {
      slug,
      parameters,
    },
  };
  ExperimentsApi.createExperiment(backendId, experimentBody)
    .then((experiment) => {
      toastr.success('Success', 'Experiment was generated');
      ExperimentsApi.startExperiment(backendId, experiment.id)
        .then((res) => {
          if (res.ok) {
            toastr.success('Success', 'Experiment was started');
          } else {
            Promise.reject(res);
          }
        });
    })
    .catch((err) => toastr('Error', err));
};

export default createExperimentInProject;

/* ----------------------------  ----------------------------------  -------------------------------*/


/**
 * Utility to generate names for branches principally
 */
export const randomNameGenerator = () => {
  const randomFirstName = Math.floor(Math.random() * Adjectives.length);
  const randomLastName = Math.floor(Math.random() * Nouns.length);
  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const dateString = `${date}${month + 1}${year}`;
  return `${Adjectives[randomFirstName]}-${Nouns[randomLastName]}_${dateString}`;
};

/* ----------------------------  ----------------------------------  -------------------------------*/

/**
 * 
 * @param {*} pipelinesToClassify: unsorted pipelines
 * @param {*} arrayOfBranches: branches in which pipelines were executed
 */
export const classifyPipeLines = (pipelinesToClassify, arrayOfBranches) => {
  const pipes = pipelinesToClassify.filter((pipe) => pipe.status !== SKIPPED);
  const infoPipelinesComplemented = arrayOfBranches.map((branch) => {
    const pipeBranch = pipes.filter((pipe) => pipe.ref === branch.name)[0];
    if (pipeBranch) {
      return {
        status: pipeBranch.status,
        name: branch.name,
        authorName: branch.commit.author_name,
        createdAt: branch.commit.created_at,
        commit: branch.commit,
      };
    }

    return null;
  }).filter((pipeline) => pipeline !== null);
  return [
    {
      status: RUNNING,
      values: infoPipelinesComplemented.filter((exp) => exp.status === RUNNING || exp.status === PENDING),
    },
    { status: SUCCESS, values: infoPipelinesComplemented.filter((exp) => exp.status === SUCCESS) },
    { status: CANCELED, values: infoPipelinesComplemented.filter((exp) => exp.status === CANCELED) },
    { status: FAILED, values: infoPipelinesComplemented.filter((exp) => exp.status === FAILED) },
    { status: EXPIRED, values: infoPipelinesComplemented.filter((exp) => exp.status === EXPIRED) },
  ];
};

/* ----------------------------  ----------------------------------  -------------------------------*/

const sortingByDateFunc = (a, b) => new Date(b.pipelineJobInfo.createdAt) - new Date(a.pipelineJobInfo.createdAt);

/**
 * 
 * @param {*}  experiments: unsorted experiments
 */
export const classifyExperiments = (experiments) => [
  {
    status: RUNNING,
    values: experiments
      .sort(sortingByDateFunc)
      .filter((exp) => exp.status === RUNNING || exp.status === PENDING),
  },
  {
    status: SUCCESS,
    values: experiments
      .sort(sortingByDateFunc)
      .filter((exp) => exp.status === SUCCESS),
  },
  {
    status: CANCELED,
    values: experiments
      .sort(sortingByDateFunc)
      .filter((exp) => exp.status === CANCELED),
  },
  {
    status: FAILED,
    values: experiments
      .sort(sortingByDateFunc)
      .filter((exp) => exp.status === FAILED),
  },
  {
    status: EXPIRED,
    values: experiments
      .sort(sortingByDateFunc)
      .filter((exp) => exp.status === EXPIRED),
  },
];

/* ----------------------------  ----------------------------------  -------------------------------*/