export type CreateUserPayload = {
  username: string;
  password: string;
  alias: string;
  roleID: number;
}

export type UpdateUserPayload = {
  password?: string;
  alias: string;
  roleID: number;
}

export type CreateGroupPayload = {
  name: string
}

export type UpdateGroupPayload = {
  name: string
}

export type UpsertFirmwarePayload = {
  file: File;
}

export type UpdateThingPayload = {
  storeName: string;
  groupID: number;
}

export type UpdateThingsGroupPayload = {
  groupID: number,
  macAddresses: string[]
}