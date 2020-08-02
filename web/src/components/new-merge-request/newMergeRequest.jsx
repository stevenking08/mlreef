import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  shape, number, string, arrayOf, func,
} from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import ProjectContainer from '../projectContainer';
import Navbar from '../navbar/navbar';
import CustomizedSelect from '../CustomizedSelect';
import BlueBorderedInput from '../BlueBorderedInput';
import './newMergeRequest.css';
import BranchesApi from '../../apis/BranchesApi.ts';
import mergeRequestAPI from '../../apis/mergeRequestApi';
import ImageDiffSection from '../imageDiffSection/imageDiffSection';
import CommitsList from '../commitsList';
import { getFileDifferences } from '../../functions/apiCalls';

const imageFormats = [
  '.png',
  '.jpg',
];

const getBranchFromSearch = search => {
  const decoded = decodeURIComponent(search.substr(1));
  const pairs = decoded.split('&').map((str) => str.split('='))
  const [, val] = pairs.find(([key, val]) => key === 'merge_request[source_branch]');

  return val;
};

export class NewMergeRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commits: [],
      lastCommit: {},
      imagesToRender: [],
      title: '',
      description: '',
      branch: '',
      branchToMergeInto: '',
      loading: false,
      redirect: false,
    };
    this.onBranchChanged = this.onBranchChanged.bind(this);
    this.onTitleChangedHandler = this.onTitleChangedHandler.bind(this);
    this.onDescriptionChangedHandler = this.onDescriptionChangedHandler.bind(this);
    this.handleCreateBranchEv = this.handleCreateBranchEv.bind(this);
  }

  componentDidMount() {
    const {
      projects: {
        selectedProject: { defaultBranch },
      },
      location: { search }
    } = this.props;

    const branch = search ? getBranchFromSearch(search) : defaultBranch;

    this.setState({ branch });
  }

  onBranchChanged(branchSelected) {
    this.setState({ branchToMergeInto: branchSelected });
    const {
      projects: {
        selectedProject,
      },
    } = this.props;

    const { branch } = this.state;

    const brApi = new BranchesApi();
    brApi.compare(selectedProject.gid, branchSelected, branch)
      .then((res) => {
        this.setState({
          lastCommit: res.commit,
          commits: res.commits,
          diffs: res.diffs,
        });
        this.getDiffDetails(res.diffs);
      }).catch((err) => {
        toastr.error('Error', err.message);
      });
  }

  onTitleChangedHandler(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onDescriptionChangedHandler(e) {
    this.setState({
      description: e.target.value,
    });
  }

  getDiffDetails(diffsArray) {
    const { lastCommit } = this.state;
    const {
      match: {
        params: {
          projectId,
        },
      },
    } = this.props;
    diffsArray.filter((diff) => imageFormats
      .filter((format) => diff.old_path.includes(format)).length > 0)
      .forEach(async (imageDiff) => {
        const { imagesToRender } = this.state;
        const {
          previousVersionFile,
          nextVersionFile,
        } = await getFileDifferences(projectId, imageDiff, lastCommit.parent_ids[0], lastCommit.id);
        imagesToRender.push({
          previousVersionFileParsed: previousVersionFile,
          nextVersionFileParsed: nextVersionFile,
          fileName: imageDiff.old_path.split('/').slice(-1)[0],
        });
        this.setState({ ...imagesToRender });
      });
  }

  handleCancel = () => {
    const {
      history,
    } = this.props;

    return history.goBack();
  };

  handleCreateBranchEv() {
    this.setState({ loading: true });
    const {
      title,
      description,
      branchToMergeInto,
      branch,
    } = this.state;
    const {
      projects: {
        selectedProject: { gid },
      },
    } = this.props;

    mergeRequestAPI
      .submitMergeReq(gid, branch, branchToMergeInto, title, description)
      .then(() => {
        this.setState({ loading: false, redirect: true });
      }).catch((err) => {
        toastr.error('Error: ', err.message);
      });
  }

  render() {
    const {
      title,
      branchToMergeInto,
      commits,
      diffs,
      imagesToRender,
      // loading,
      redirect,
      branch,
    } = this.state;
    const isEnabledCreateMergeReq = title.length > 0
        && branchToMergeInto.length > 0;
    const {
      projects: {
        selectedProject,
      },
      branches,
      users,
    } = this.props;

    const groupName = selectedProject.namespace.name;

    const { namespace, slug } = selectedProject;

    return (
      <>
        {redirect && (
          <Redirect to={`/${namespace}/${slug}`} />
        )}
        <Navbar />
        <ProjectContainer
          activeFeature="data"
          folders={[groupName, selectedProject.name, 'Data', 'New merge request']}
        />
        <div className="main-content">
          <br />
          <p style={{ color: '#1A2B3F', fontSize: '1em' }}>
            <b>New Merge request</b>
          </p>
          <br />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: 'max-content',
          }}
          >
            <p id="branch-selected-name" variant="h6" component="h5" style={{ color: '#1A2B3F', fontSize: '1.1em' }}>
              from&nbsp;
              <Link to={`/${namespace}/${slug}/-/tree/${branch}`}>
                <b>{decodeURIComponent(branch)}</b>
              </Link>
              &nbsp;into
            </p>
            &nbsp;
            <div style={{ marginLeft: '1em', width: '20%' }}>
              <CustomizedSelect
                options={branches.filter((branchForSelect) => branchForSelect !== branch)}
                inputId="branches-select"
                onChangeHandler={this.onBranchChanged}
                inputLabelText="Select a branch"
              />
            </div>
          </div>
          <br />
          <br />
          <div style={{ borderTop: '1px solid #e5e5e5' }}>
            <div style={{ display: 'flex', marginLeft: '10%', marginTop: '3em' }}>
              <p style={{
                width: '6em', textAlign: 'end', fontWeight: '700', marginRight: '2em',
              }}
              >
                Title
              </p>
              <BlueBorderedInput id="title-mr-input" style={{ width: '100%' }} onChange={this.onTitleChangedHandler} />
            </div>
            <div style={{ display: 'flex', marginLeft: '10%', marginTop: '3em' }}>
              <p style={{
                width: '6em', textAlign: 'end', fontWeight: '700', marginRight: '2em',
              }}
              >
                Description
              </p>
              <BlueBorderedInput
                id="description-mr-input"
                multiline
                rows="4"
                placeholder="Describe the goal
                  of the changes and what
                  the reviewers must pay attention at"
                onChange={this.onDescriptionChangedHandler}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div style={{
            display: 'flex',
            backgroundColor: '#F9F8F8',
            padding: '1em 2em',
            justifyContent: 'space-between',
          }}
          >
            <button
              id="cancel-button"
              type="button"
              className="btn btn-basic-dark"
              onClick={this.handleCancel}
            >
              Cancel
            </button>

            <button
              id="submit-merge-request"
              type="button"
              className="btn btn-primary"
              onClick={this.handleCreateBranchEv}
              disabled={!isEnabledCreateMergeReq}
            >
              Submit merge request
            </button>
          </div>
          <br />
          {commits.length > 0 && (
            <CommitsList
              commits={commits}
              users={users}
              projectId={selectedProject.gid}
              changesNumber={diffs.length}
            />
          )}
          {imagesToRender.map((imageFile) => (
            <ImageDiffSection key={imageFile.fileName} imageFile={imageFile} />
          ))}
        </div>
      </>
    );
  }
}

NewMergeRequest.propTypes = {
  projects: shape({
    selectedProject: shape({
      gid: number.isRequired,
    }).isRequired,
  }).isRequired,
  location: shape({
    search: string.isRequired,
  }).isRequired,
  match: shape({
    params: shape({
      namespace: string.isRequired,
      slug: string.isRequired,
    }),
  }).isRequired,
  branches: arrayOf(string).isRequired,
  users: arrayOf(
    shape({
      name: string.isRequired,
    }).isRequired,
  ).isRequired,
  history: shape({
    goBack: func.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    users: state.users,
    projects: state.projects,
    branches: state.branches.map((branch) => branch.name),
  };
}

export default connect(mapStateToProps)(NewMergeRequest);
