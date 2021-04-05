import {createActions} from 'redux-actions';
import axios from '../helpers/axiosConfig';

export const {
  fetchViewPhotosStarted,
  fetchViewPhotosSuccess,
  fetchViewPhotosFailure,
  fetchViewDocumentsStarted,
  fetchViewDocumentsSuccess,
  fetchViewDocumentsFailure,
  fetchViewCoursesStarted,
  fetchViewCoursesSuccess,
  fetchViewCoursesFailure,
  fetchViewExperiencesStarted,
  fetchViewExperiencesSuccess,
  fetchViewExperiencesFailure,
  fetchViewProjectsStarted,
  fetchViewProjectsSuccess,
  fetchViewProjectsFailure,
  fetchViewUserStarted,
  fetchViewUserSuccess,
  fetchViewUserFailure,
  fetchViewProjectStarted,
  fetchViewProjectSuccess,
  fetchViewProjectFailure
} = createActions(
  {
    FETCH_VIEW_PHOTOS_SUCCESS: (data) => ({data}),
    FETCH_VIEW_PHOTOS_FAILURE: (error) => ({error}),
    FETCH_VIEW_DOCUMENTS_SUCCESS: (data) => ({data}),
    FETCH_VIEW_DOCUMENTS_FAILURE: (error) => ({error}),
    FETCH_VIEW_COURSES_SUCCESS: (data) => ({data}),
    FETCH_VIEW_COURSES_FAILURE: (error) => ({error}),
    FETCH_VIEW_EXPERIENCES_SUCCESS: (data) => ({data}),
    FETCH_VIEW_EXPERIENCES_FAILURE: (error) => ({error}),
    FETCH_VIEW_PROJECTS_SUCCESS: (data) => ({data}),
    FETCH_VIEW_PROJECTS_FAILURE: (error) => ({error}),
    FETCH_VIEW_USER_SUCCESS: (data) => ({data}),
    FETCH_VIEW_USER_FAILURE: (error) => ({error}),
    FETCH_VIEW_PROJECT_SUCCESS: (data) => ({data}),
    FETCH_VIEW_PROJECT_FAILURE: (error) => ({error}),

  },
  'FETCH_VIEW_PHOTOS_STARTED',
  'FETCH_VIEW_DOCUMENTS_STARTED',
  'FETCH_VIEW_COURSES_STARTED',
  'FETCH_VIEW_EXPERIENCES_STARTED',
  'FETCH_VIEW_PROJECTS_STARTED',
  'FETCH_VIEW_USER_STARTED',
  'FETCH_VIEW_PROJECT_STARTED',

);

export const fetchViewPhotos = (page,user_id) => {
  return async (dispatch) => {
    dispatch(fetchViewPhotosStarted());
    try {
      const response = await axios.get(`/view/${user_id}/image?page=${page}`);
      dispatch(fetchViewPhotosSuccess(response.data));
    } catch (error) {
      dispatch(fetchViewPhotosFailure('Could not retrieve photos.'));
    }
  };
};

export const fetchViewDocuments = (page,user_id) => {
  return async (dispatch) => {
    dispatch(fetchViewDocumentsStarted());

    try {
      const response = await axios.get(`/view/${user_id}/pdf?page=${page}`);
      dispatch(fetchViewDocumentsSuccess(response.data));
    } catch (error) {
      dispatch(fetchViewDocumentsFailure('Could not retrieve documents.'));
    }
  };
};
export const fetchViewUser = (page,user_id) => {
  return async (dispatch) => {
    dispatch(fetchViewUserStarted());
    try {
      const response = await axios.get(`/view/${user_id}?page=${page}`);
      dispatch(fetchViewUserSuccess(response.data));
    } catch (error) {
      dispatch(fetchViewUserFailure('Could not retrieve user.'));
    }
  }
};

export const fetchViewProjects = (condition,user_id) => {
  return async (dispatch) => {
    dispatch(fetchViewProjectsStarted());

    try {
      const response = await axios.post(`/view/${user_id}/project/conditional`, condition);
      dispatch(fetchViewProjectsSuccess(response.data));
    } catch (error) {
      dispatch(fetchViewProjectsFailure('Could not rerieve project lists based on required condition.'));
    }
  };
};

export const fetchViewProject = (projectid,user_id) => {
  return async (dispatch) => {
    dispatch(fetchViewProjectStarted());
    try {
      const response = await axios.get(`/view/${user_id}/project/${projectid}`);
      dispatch(fetchViewProjectSuccess(response.data));
    } catch (error) {
      dispatch(fetchViewProjectFailure('Could not retrieve the project.'));
    }
  };
};

export const fetchViewCourses = (user_id) => {
  return async (dispatch) => {
    dispatch(fetchViewCoursesStarted());

    try {
      const response = await axios.get(`/view/${user_id}/course`);
      dispatch(fetchViewCoursesSuccess(response.data));
    } catch (error) {
      dispatch(fetchViewCoursesFailure('Could not retrieve courses.'));
    }
  };
};

export const fetchViewExperiences = (user_id) => {
  return async (dispatch) => {
    dispatch(fetchViewExperiencesStarted());

    try {
      const response = await axios.get(`/view/${user_id}/experience`);
      dispatch(fetchViewExperiencesSuccess(response.data));
    } catch (error) {
      dispatch(fetchViewExperiencesFailure('Could not retrieve experiences.'));
    }
  };
};