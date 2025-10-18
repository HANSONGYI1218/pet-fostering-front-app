export type FosterFilterValue<T> = T | 'ALL';

export type FosterFilterOptions<TType, TSize, TGender> = {
  type?: FosterFilterValue<TType>;
  size?: FosterFilterValue<TSize>;
  gender?: FosterFilterValue<TGender>;
  keyword?: string;
};
