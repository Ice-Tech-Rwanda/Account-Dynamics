"use client";

import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface UseAdminListOptions {
  endpoint: string;
  pageSize?: number;
  initialParams?: Record<string, string>;
}

interface AdminListState<T> {
  data: T[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  params: Record<string, string>;
}

export function useAdminList<T extends { id: string }>({
  endpoint,
  pageSize = 20,
  initialParams = {},
}: UseAdminListOptions) {
  const [state, setState] = useState<AdminListState<T>>({
    data: [],
    total: 0,
    page: 1,
    loading: true,
    error: null,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    params: initialParams,
  });

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const sp = new URLSearchParams();
      sp.set("page", String(state.page));
      sp.set("limit", String(pageSize));
      if (state.search) sp.set("q", state.search);
      sp.set("sort", state.sortBy);
      sp.set("order", state.sortOrder);
      for (const [k, v] of Object.entries(state.params)) {
        if (v) sp.set(k, v);
      }

      const res = await adminFetch(`${endpoint}?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();

      setState((s) => ({
        ...s,
        data: json.data ?? [],
        total: json.pagination?.total ?? 0,
        loading: false,
      }));
    } catch (err: any) {
      setState((s) => ({ ...s, loading: false, error: err.message || "Failed to load" }));
    }
  }, [endpoint, state.page, state.search, state.sortBy, state.sortOrder, state.params, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setSearch = (search: string) => {
    setState((s) => ({ ...s, search, page: 1 }));
  };

  const setPage = (page: number) => {
    setState((s) => ({ ...s, page }));
  };

  const setSort = (sortBy: string, sortOrder: "asc" | "desc" = "asc") => {
    setState((s) => ({ ...s, sortBy, sortOrder, page: 1 }));
  };

  const setParams = (params: Record<string, string>) => {
    setState((s) => ({ ...s, params: { ...s.params, ...params }, page: 1 }));
  };

  const refresh = () => fetchData();

  return {
    ...state,
    setSearch,
    setPage,
    setSort,
    setParams,
    refresh,
    totalPages: Math.ceil(state.total / pageSize),
  };
}
