import { useState, useEffect, useCallback } from "react";
import { get } from "./api_helper";
import {
  GET_UPLOAD_CONFIG,
  CONTAINER,
  USER,
  CAMERA,
  CAMERA_GROUP,
} from "./url_helper";

export function useUploadConfig() {
  const [state, setState] = useState({});

  useEffect(() => {
    (async () => {
      const { data, success } = await get(GET_UPLOAD_CONFIG);
      if (success) {
        setState(data);
      }
    })();
  }, []);

  return state;
}

export const useContainer = id => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data } = await get(`${CONTAINER}/${id}`);

    setData(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [data, loading, fetchData];
};

export const useUser = id => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data } = await get(`${USER}/${id}`);

    setData(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [data, loading, fetchData];
};

export const useCameraGroup = id => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data } = await get(`${CAMERA_GROUP}/${id}`);

    setData(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [data, loading, fetchData];
};

export const useCamera = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data } = await get(`${CAMERA}/group`);

    setData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [data, loading, fetchData];
};
