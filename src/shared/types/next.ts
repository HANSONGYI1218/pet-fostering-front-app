export type AsyncParams<TParams extends object> = {
  params: Promise<TParams>;
};

export type AsyncSearchParams<TParams extends object> = {
  searchParams?: Promise<TParams>;
};
