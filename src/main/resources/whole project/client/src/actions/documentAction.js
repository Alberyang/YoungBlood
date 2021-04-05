import { createActions } from "redux-actions";
import axios from "../helpers/axiosConfig";
import { push } from "connected-react-router";

export const {
  fetchDocumentsStarted,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  fetchDocumentStarted,
  fetchDocumentSuccess,
  fetchDocumentFailure,
  updateDocumentStarted,
  updateDocumentSuccess,
  updateDocumentFailure,
  postDocumentStarted,
  postDocumentSuccess,
  postDocumentFailure,
  deleteDocumentStarted,
  deleteDocumentSuccess,
  deleteDocumentFailure,
} = createActions(
  {
    FETCH_DOCUMENTS_SUCCESS: (data) => ({ data }),
    FETCH_DOCUMENTS_FAILURE: (error) => ({ error }),
    FETCH_DOCUMENT_SUCCESS: (data) => ({ data }),
    FETCH_DOCUMENT_FAILURE: (error) => ({ error }),
    POST_DOCUMENT_SUCCESS: (data) => ({ data }),
    POST_DOCUMENT_FAILURE: (error) => ({ error }),
    UPDATE_DOCUMENT_SUCCESS: (data) => ({ data }),
    UPDATE_DOCUMENT_FAILURE: (error) => ({ error }),
    DELETE_DOCUMENT_SUCCESS: (data) => ({ data }),
    DELETE_DOCUMENT_FAILURE: (error) => ({ error }),
  },
  "FETCH_DOCUMENTS_STARTED",
  "FETCH_DOCUMENT_STARTED",
  "POST_DOCUMENT_STARTED",
  "UPDATE_DOCUMENT_STARTED",
  "DELETE_DOCUMENT_STARTED"
);

export const fetchDocuments = (page) => {
  return async (dispatch) => {
    dispatch(fetchDocumentsStarted());

    try {
      const response = await axios.get(`/pdf?page=${page}`);
      dispatch(fetchDocumentsSuccess(response.data));
    } catch (error) {
      dispatch(fetchDocumentsFailure("Could not retrieve documents."));
    }
  };
};

export const fetchDocument = (filename) => {
  return async (dispatch) => {
    dispatch(fetchDocumentStarted());

    try {
      const response = await axios.get(`/pdf/${filename}`);
      dispatch(fetchDocumentSuccess(response.data));
    } catch (error) {
      dispatch(fetchDocumentFailure("Could not retrieve document."));
    }
  };
};

export const deleteDocument = (id) => {
  return async (dispatch) => {
    dispatch(deleteDocumentStarted());

    try {
      await axios.delete(`/pdf/${id}`);
      dispatch(deleteDocumentSuccess(id));
      dispatch(push("/document"));
    } catch (error) {
      dispatch(deleteDocumentFailure("Could not delete document."));
    }
  };
};
export const updateDocument = (id, data, redirect = true) => {
  return async (dispatch) => {
    dispatch(updateDocumentStarted());

    try {
      const response = await axios.post(`/pdf/title/${id}`, data);
      console.log(response.data);
      dispatch(updateDocumentSuccess(id));

      if (redirect) {
        dispatch(push("/document"));
      }
    } catch (error) {
      dispatch(updateDocumentFailure("Could not update document."));
    }
  };
};

export const postDocument = (url, data) => {
  return async (dispatch) => {
    dispatch(postDocumentStarted());

    try {
      const response = await axios.post(url, data);
      dispatch(postDocumentSuccess(response.data));
      dispatch(push("/document"));
    } catch (error) {
      dispatch(postDocumentFailure("Could not add document."));
    }
  };
};
