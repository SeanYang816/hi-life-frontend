
export type Updater<T> = T | ((old: T) => T);
export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void;

export type SelectOptionProps = {
  label: string;
  value: string | number | null;
}

export type PaginationInputType = {
  pageIndex: number;
  pageSize: number;
}

export type ValueMap = Map<number, string>

export type ThingLogType = {
  label: string;
  values: ValueMap;
}

export type ThingLogTypes = Map<number, ThingLogType>

// Token
export type AuthPayload = {
  username: string;
  alias: string;
  roleID: number;
  permissionsIDs: number[];
  createdAt: Date;
};

export type DecodedToken = {
  username: string;
  alias: string;
  roleID: number;
  permissionsIDs: number[];
  createdAt: string;
  iat: number;
  exp: number;
};