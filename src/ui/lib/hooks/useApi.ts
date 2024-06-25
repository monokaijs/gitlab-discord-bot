import { useState } from 'react';
import apiService from "@/ui/lib/services/api.service.ts";

type ApiResponse<Data> = {
  data?: Data;
  message?: string;
  error?: any;
};

type ApiFunction<Args extends any[], Data> = (...args: Args) => Promise<ApiResponse<Data>>;

export default function useApi<Data>(apiFunc: ApiFunction<any, Data>, apiCtx?: any, defaultValue: any = undefined) {
  const [data, setData] = useState<Data>(defaultValue);
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  const caller = async (...args: Parameters<typeof apiFunc>) => {
    setLoading(true);
    try {
      const boundFunc = apiFunc.bind(apiCtx || apiService);
      const response = await boundFunc(...args);
      setData(response.data);
      setMessage(response.message);
      setSuccess(true);
      return response;
    } catch (err) {
      setMessage(err.message);
      setError(err);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [caller, { data, error, message, loading }] as const;
}
