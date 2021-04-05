import { createActions } from "redux-actions";
import axios from "../helpers/axiosConfig";

export const {
  fetchExperiencesStarted,
  fetchExperiencesSuccess,
  fetchExperiencesFailure,
  postExperienceStarted,
  postExperienceSuccess,
  postExperienceFailure,
  deleteExperienceStarted,
  deleteExperienceSuccess,
  deleteExperienceFailure,
  updateExperienceStarted,
  updateExperienceSuccess,
  updateExperienceFailure,
} = createActions(
  {
    FETCH_EXPERIENCES_SUCCESS: (data) => ({ data }),
    FETCH_EXPERIENCES_FAILURE: (error) => ({ error }),
    POST_EXPERIENCE_SUCCESS: (data) => ({ data }),
    POST_EXPERIENCE_FAILURE: (error) => ({ error }),
    UPDATE_EXPERIENCE_SUCCESS: (data) => ({ data }),
    UPDATE_EXPERIENCE_FAILURE: (error) => ({ error }),
    DELETE_EXPERIENCE_SUCCESS: (data) => ({ data }),
    DELETE_EXPERIENCE_FAILURE: (error) => ({ error }),
  },
  "FETCH_EXPERIENCES_STARTED",
  "POST_EXPERIENCE_STARTED",
  "DELETE_EXPERIENCE_STARTED",
  "UPDATE_EXPERIENCE_STARTED"
);

export const fetchExperiences = () => {
  return async (dispatch) => {
    dispatch(fetchExperiencesStarted());

    try {
      const response = await axios.get(`/experience`);
      dispatch(fetchExperiencesSuccess(response.data));
    } catch (error) {
      dispatch(fetchExperiencesFailure("Could not retrieve experiences."));
    }
  };
};

export const deleteExperience = (id) => {
  return async (dispatch) => {
    dispatch(deleteExperienceStarted());

    try {
      await axios.delete(`/experience/${id}`);
      dispatch(deleteExperienceSuccess(id));
      //dispatch(push('/experience'));
    } catch (error) {
      dispatch(deleteExperienceFailure("Could not delete experience."));
    }
  };
};

export const postExperience = (data) => {
  return async (dispatch) => {
    dispatch(postExperienceStarted());

    try {
      const response = await axios.post("/experience/create", data);
      dispatch(postExperienceSuccess(response.data));
    } catch (error) {
      dispatch(postExperienceFailure("Could not create experience."));
    }
  };
};

export const editExperience = (id, data) => {
  return async (dispatch) => {
    dispatch(updateExperienceStarted());

    try {
      const response = await axios.post(`/experience/update/${id}`, data);
      dispatch(updateExperienceSuccess(response.data));
    } catch (error) {
      dispatch(updateExperienceFailure("Could not update experience."));
    }
  };
};
