import {createActions} from 'redux-actions';
import axios from '../helpers/axiosConfig';

export const {
  fetchCoursesStarted,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  postCourseStarted,
  postCourseSuccess,
  postCourseFailure,
  deleteCourseStarted,
  deleteCourseSuccess,
  deleteCourseFailure,
  updateCourseStarted,
  updateCourseSuccess,
  updateCourseFailure,
} = createActions(
  {
    FETCH_COURSES_SUCCESS: (data) => ({data}),
    FETCH_COURSES_FAILURE: (error) => ({error}),
    POST_COURSE_SUCCESS: (data) => ({data}),
    POST_COURSE_FAILURE: (error) => ({error}),
    UPDATE_COURSE_SUCCESS: (data) => ({data}),
    UPDATE_COURSE_FAILURE: (error) => ({error}),
    DELETE_COURSE_SUCCESS: (data) => ({data}),
    DELETE_COURSE_FAILURE: (error) => ({error})
  },
  'FETCH_COURSES_STARTED',
  'POST_COURSE_STARTED',
  'DELETE_COURSE_STARTED',
  'UPDATE_COURSE_STARTED'
);

export const fetchCourses = () => {
  return async (dispatch) => {
    dispatch(fetchCoursesStarted());

    try {
      const response = await axios.get(`/course`);
      dispatch(fetchCoursesSuccess(response.data));
    } catch (error) {
      dispatch(fetchCoursesFailure('Could not retrieve courses.'));
    }
  };
};

export const deleteCourse = (id) => {
  return async (dispatch) => {
    dispatch(deleteCourseStarted());

    try {
      await axios.delete(`/course/${id}`);
      dispatch(deleteCourseSuccess(id));
      //dispatch(push('/experience'));
    } catch (error) {
      dispatch(deleteCourseFailure('Could not delete course.'));
    }
  };
};

export const postCourse = (data) => {
  return async (dispatch) => {
    dispatch(postCourseStarted());

    try {
      const response = await axios.post('/course/create', data);
      dispatch(postCourseSuccess(response.data));
    } catch (error) {
      dispatch(postCourseFailure('Could not create course.'));
    }
  };
};

export const editCourse = (id, data) => {
  return async (dispatch) => {
    dispatch(updateCourseStarted());

    try {
      const response = await axios.post(`/course/${id}`, data);
      dispatch(updateCourseSuccess(response.data));
    } catch (error) {
      dispatch(updateCourseFailure('Could not update course.'));
    }
  };
};



