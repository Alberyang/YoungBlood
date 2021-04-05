import { createActions } from 'redux-actions';
import axios from '../helpers/axiosConfig';
//import { push } from 'connected-react-router';

export const {
  //projectlist
  fetchProjectListStarted,
  fetchProjectListSuccess,
  fetchProjectListFailure,
  fetchProjectListConditionStarted,
  fetchProjectListConditionSuccess,
  fetchProjectListConditionFailure,
  //one project
  createProjectStarted,
  createProjectSuccess,
  createProjectFailure,
  fetchProjectStarted,
  fetchProjectSuccess,
  fetchProjectFailure,
  updateProjectStarted,
  updateProjectSuccess,
  updateProjectFailure,
  likeProjectStarted,
  likeProjectSuccess,
  likeProjectFailure,
  deleteProjectStarted,
  deleteProjectSuccess,
  deleteProjectFailure,
  //contributor
  createContributorStarted,
  createContributorSuccess,
  createContributorFailure,
  deleteContributorStarted,
  deleteContributorSuccess,
  deleteContributorFailure,
  //process
  createProcessStarted,
  createProcessSuccess,
  createProcessFailure,
  updateProcessStarted,
  updateProcessSuccess,
  updateProcessFailure,
  deleteProcessStarted,
  deleteProcessSuccess,
  deleteProcessFailure,
  //node
  createNodeStarted,
  createNodeSuccess,
  createNodeFailure,
  updateNodeStarted,
  updateNodeSuccess,
  updateNodeFailure,
  deleteNodeStarted,
  deleteNodeSuccess,
  deleteNodeFailure,
  finishNodeStarted,
  finishNodeSuccess,
  finishNodeFailure,
  //timeline
  createTimelineStarted,
  createTimelineSuccess,
  createTimelineFailure,
  updateTimelineStarted,
  updateTimelineSuccess,
  updateTimelineFailure,
  deleteTimelineStarted,
  deleteTimelineSuccess,
  deleteTimelineFailure,
} = createActions(
  {
    FETCH_PROJECT_LIST_SUCCESS: (data) => ({ data }),
    FETCH_PROJECT_LIST_FAILURE: (error) => ({ error }),
    FETCH_PROJECT_LIST_CONDITION_SUCCESS: (data) => ({ data }),
    FETCH_PROJECT_LIST_CONDITION_FAILURE: (error) => ({ error }),
    FETCH_PROJECT_SUCCESS: (data) => ({ data }),
    FETCH_PROJECT_FAILURE: (error) => ({ error }),
    CREATE_PROJECT_SUCCESS: (data) => ({ data }),
    CREATE_PROJECT_FAILURE: (error) => ({ error }),
    UPDATE_PROJECT_SUCCESS: (data) => ({ data }),
    UPDATE_PROJECT_FAILURE: (error) => ({ error }),
    DELETE_PROJECT_SUCCESS: (data) => ({ data }),
    DELETE_PROJECT_FAILURE: (error) => ({ error }),
    LIKE_PROJECT_SUCCESS: (data) => ({ data }),
    LIKE_PROJECT_FAILURE: (error) => ({ error }),

    CREATE_CONTRIBUTOR_SUCCESS: (data) => ({ data }),
    CREATE_CONTRIBUTOR_FAILURE: (error) => ({ error }),
    DELETE_CONTRIBUTOR_SUCCESS: (data) => ({ data }),
    DELETE_CONTRIBUTOR_FAILURE: (error) => ({ error }),

    CREATE_PROCESS_SUCCESS: (data) => ({ data }),
    CREATE_PROCESS_FAILURE: (error) => ({ error }),
    UPDATE_PROCESS_SUCCESS: (data) => ({ data }),
    UPDATE_PROCESS_FAILURE: (error) => ({ error }),
    DELETE_PROCESS_SUCCESS: (data) => ({ data }),
    DELETE_PROCESS_FAILURE: (error) => ({ error }),

    CREATE_NODE_SUCCESS: (data) => ({ data }),
    CREATE_NODE_FAILURE: (error) => ({ error }),
    UPDATE_NODE_SUCCESS: (data) => ({ data }),
    UPDATE_NODE_FAILURE: (error) => ({ error }),
    FINISH_NODE_SUCCESS: (data) => ({ data }),
    FINISH_NODE_FAILURE: (error) => ({ error }),
    DELETE_NODE_SUCCESS: (data) => ({ data }),
    DELETE_NODE_FAILURE: (error) => ({ error }),

    CREATE_TIMELINE_SUCCESS: (data) => ({ data }),
    CREATE_TIMELINE_FAILURE: (error) => ({ error }),
    UPDATE_TIMELINE_SUCCESS: (data) => ({ data }),
    UPDATE_TIMELINE_FAILURE: (error) => ({ error }),
    DELETE_TIMELINE_SUCCESS: (data) => ({ data }),
    DELETE_TIMELINE_FAILURE: (error) => ({ error }),
  },
  'FETCH_PROJECT_LIST_STARTED',
  'FETCH_PROJECT_LIST_CONDITION_STARTED',
  'CREATE_PROJECT_STARTED',
  'UPDATE_PROJECT_STARTED',
  'FETCH_PROJECT_STARTED',
  'DELETE_PROJECT_STARTED',
  'LIKE_PROJECT_STARTED',

  'CREATE_CONTRIBUTOR_STARTED',
  'CREATE_PROCESS_STARTED',
  'CREATE_NODE_STARTED',
  'CREATE_TIMELINE_STARTED',

  'UPDATE_PROCESS_STARTED',
  'UPDATE_NODE_STARTED',
  'UPDATE_TIMELINE_STARTED',
  
  'DELETE_CONTRIBUTOR_STARTED',
  'DELETE_PROCESS_STARTED',
  'DELETE_NODE_STARTED',
  'DELETE_TIMELINE_STARTED',

  'FINISH_NODE_STARTED'
);

//fetch project list: in none; out: list of projects
//create project: in: create name && ? description; out: the project
//fetch a project: in: projectid; out: the project
//delete a project: in: projectid; out: projectid
//fetch project conditionally: in: condition; out: project lists

//update general: in: name && description; out: project
//update status: in: show_status ; out: project
//=>both use the same post request

//create contributor: in:[name] ; out: project
//delete contributor: in:[name] ; out: project

//create a process: in:processNum, status, descriptions; out: project
//update a process: in: description && processid; out:project
//delete a process: in: processid; out: project

//create a node: in: processId && description; out: project
//update a node: in: processID && nodeId && description; out: project
//delete a node: in: processID && nodeID; out: project
//finish a node: in: processID && nodeID; out: project

//create a timeline: in: time && description ; out: project
//update a timeline: in: index, description && time; out: project
//delete a timeline: in: index ; out: project

//like a project: in:none; out: current rating

//featch all projects

export const fetchProjectList = () => {
  return async (dispatch) => {
    dispatch(fetchProjectListStarted());

    try {
      const response = await axios.get(`/project/`);
      dispatch(fetchProjectListSuccess(response.data));
    } catch (error) {
      dispatch(fetchProjectListFailure('Could not rerieve project lists.'));
    }
  };
};

//fetch the project based on condition
export const fetchProjectListCondition = (condition) => {
  return async (dispatch) => {
    dispatch(fetchProjectListConditionStarted());

    try {
      const response = await axios.post(`/project/conditional`, condition);
      dispatch(fetchProjectListConditionSuccess(response.data));
    } catch (error) {
      dispatch(fetchProjectListConditionFailure('Could not rerieve project lists based on required condition.'));
    }
  };
};


//fetch particular project
export const fetchProject = (projectid) => {
  return async (dispatch) => {
    dispatch(fetchProjectStarted());

    try {
      const response = await axios.get(`/project/${projectid}`);
      dispatch(fetchProjectSuccess(response.data));
    } catch (error) {
      dispatch(fetchProjectFailure('Could not retrieve the project.'));
    }
  };
};

//create a project
export const createProject = (data) => {
  return async (dispatch) => {
    dispatch(createProjectStarted());

    try {
      const response = await axios.post(`/project/create`, data);
      dispatch(createProjectSuccess(response.data));
      //dispatch(push('/project'));
    } catch (error) {
      //console.log(error)
      dispatch(createProjectFailure('Could not create project.'));
    }
  };
};

//delete a project
export const deleteProject = (id) => {
  return async (dispatch) => {
    dispatch(deleteProjectStarted());

    try {
      await axios.delete(`/project/${id}`);
      dispatch(deleteProjectSuccess(id));
      //dispatch(push('/project'));
    } catch (error) {
      //console.log(error)
      dispatch(deleteProjectFailure('Could not delete project.'));
    }
  };
};

//like a project
export const likeProject = (id) => {
  return async (dispatch) => {
    dispatch(likeProjectStarted());

    try {
      await axios.post(`/project/like/${id}`);
      dispatch(likeProjectSuccess(id));
      //dispatch(push('/project'));
    } catch (error) {
      //console.log(error)
      dispatch(likeProjectFailure('Could not like project.'));
    }
  };
};

//this use to update project general info and status
export const updateProject = (info, id) => {
  return async (dispatch) => {
    dispatch(updateProjectStarted());

    try {
      const response = await axios.post(`/project/update/${id}`, info);
      dispatch(updateProjectSuccess(response.data));
    } catch (error) {
      //console.log(error);
      dispatch(updateProjectFailure('Could not update project general details and status.'));
    }
  };
};


//create contributor
export const createContributor = (contributors, id) => {
  return async (dispatch) => {
    dispatch(createContributorStarted());

    try {
      const response = await axios.post(`/project/add_people/${id}`, contributors);
      dispatch(createContributorSuccess(response.data));
    } catch (error) {
      dispatch(createContributorFailure('Could not create a new contributor.'));
    }
  };
};

//delete contributor
export const deleteContributor = (contributors, id) => {
  return async (dispatch) => {
    dispatch(deleteContributorStarted());

    try {
      const response = await axios.post(`/project/remove_people/${id}`, contributors);
      dispatch(deleteContributorSuccess(response.data));
    } catch (error) {
      dispatch(deleteContributorFailure('Could not delete an existing contributor.'));
    }
  };
};

//create process
export const createProcess = (info, id) => {
  return async (dispatch) => {
    dispatch(createProcessStarted());

    try {
      const response = await axios.post(`/project/process/${id}`, info);
      dispatch(createProcessSuccess(response.data));
    } catch (error) {
      dispatch(createProcessFailure('Could not create a new process.'));
    }
  };
};

//update process
export const updateProcess = (info, id) => {
  return async (dispatch) => {
    dispatch(updateProcessStarted());

    try {
      const response = await axios.post(`/project/process/update/${id}`, info);
      dispatch(updateProcessSuccess(response.data));
    } catch (error) {
      dispatch(updateProcessFailure('Could not update the process details.'));
    }
  };
};

//delete process
export const deleteProcess = (info, id) => {
  return async (dispatch) => {
    dispatch(deleteProcessStarted());

    try {
      const response = await axios.post(`/project/process/remove/${id}`, info);
      dispatch(deleteProcessSuccess(response.data));
    } catch (error) {
      dispatch(deleteProcessFailure('Could not delete an existing process.'));
    }
  };
};

//create node
export const createNode = (info, id) => {
  return async (dispatch) => {
    dispatch(createNodeStarted());

    try {
      const response = await axios.post(`/project/process/node/${id}`, info);
      dispatch(createNodeSuccess(response.data));
    } catch (error) {
      dispatch(createNodeFailure('Could not create a new task in this process.'));
    }
  };
};

//update node
export const updateNode = (info, id) => {
  return async (dispatch) => {
    dispatch(updateNodeStarted());

    try {
      const response = await axios.post(`/project/process/node/update/${id}`, info);
      dispatch(updateNodeSuccess(response.data));
    } catch (error) {
      dispatch(updateNodeFailure('Could not update the task details.'));
    }
  };
};


//delete node
export const deleteNode = (info, id) => {
  return async (dispatch) => {
    dispatch(deleteNodeStarted());

    try {
      const response = await axios.post(`/project/process/node/remove/${id}`, info);
      dispatch(deleteNodeSuccess(response.data));
    } catch (error) {
      dispatch(deleteNodeFailure('Could not delete the seleted task.'));
    }
  };
};

//finish node
export const finishNode = (info, id) => {
  return async (dispatch) => {
    dispatch(finishNodeStarted());

    try {
      const response = await axios.post(`/project/process/node/finish/${id}`, info);
      dispatch(finishNodeSuccess(response.data));
    } catch (error) {
      dispatch(finishNodeFailure('Could not update the state of this task.'));
    }
  };
};

//create timeline
export const createTimeline = (info, id) => {
  return async (dispatch) => {
    dispatch(createTimelineStarted());

    try {
      const response = await axios.post(`/project/timeline/${id}`, info);
      dispatch(createTimelineSuccess(response.data));
    } catch (error) {
      dispatch(createTimelineFailure('Could not create a new event in timeline.'));
    }
  };
};

//update timeline
export const updateTimeline = (info, id) => {
  return async (dispatch) => {
    dispatch(updateTimelineStarted());

    try {
      const response = await axios.post(`/project/timeline/update/${id}`, info);
      dispatch(updateTimelineSuccess(response.data));
    } catch (error) {
      dispatch(updateTimelineFailure('Could not updating the event details.'));
    }
  };
};

//delete timeline
export const deleteTimeline = (info, id) => {
  return async (dispatch) => {
    dispatch(deleteTimelineStarted());

    try {
      const response = await axios.post(`/project/timeline/remove/${id}`, info);
      dispatch(deleteTimelineSuccess(response.data));
    } catch (error) {
      dispatch(deleteTimelineFailure('Could not delete the selected events.'));
    }
  };
};











