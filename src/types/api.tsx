import { FunPlayMemberLevel, UserRoleId, WsEventType } from 'enums'

export type OverviewResponseType = {
  totalCnt: number;
  onlineCnt: number;
  offlineCnt: number;
} & StreamingSourceType;

export type StreamingSourceType = {
  offlineCnt: number;
  playingCnt: number;
  stoppedCnt: number;
  streamingCnt: number;
  advertisingCnt: number;
  backupCnt: number;
};

export type ThingsTopologyType = {
  macAddress: string;
  groupID: number;
  groupName: string;
  ip: string;
  storeName: string;
  isOnline: boolean;
};

export type GetLoginStatusLogsType = {
  logs: {
    loginCount: number;
    notLoginCount: number;
    unknownCount: number;
    createdAt: Date;
  }
};

export type GetLoginStatusResponseType = {
  logs: GetLoginStatusLogsType[];
};

export type UserResponseType = {
  username: string;
  alias: string;
  roleID: UserRoleId;
  createdAt: Date;
  creator: string;
};

export type GroupResponseType = {
  id: number;
  name: string;
  creatorName: string;
  createdAt: Date;
  updatedAt: Date;
  thingCount: number;
};

export type FirmwareResponseType = {
  id: number;
  fileName: string;
  createdAt: Date;
  creator: {
    username: string;
  };
};

export type DeviceLogsResponseType = {
  id: string;
  content: string;
  macAddress: string;
  deviceLoggedAt: Date;
  serverLoggedAt: Date;
};

export type GetThingResponse = {
  isArchived: boolean;
  macAddress: string;
  machineCode: string;
  model: string;
  memberLevel: FunPlayMemberLevel;
  storeName: string;
  groupID: number;
  groupName: string;

  onlineStatus: boolean;
  playingInfo: string;
  uptime: number;
  txBytes: number;
  rxBytes: number;

  firmwareVersion: string;

  lastContactedAt: Date;
};

export type GetThingsResponse = {
  things: GetThingResponse[];
  total: number;
};

export type GetThingTxRxBytesLogsResponse = {
  event: WsEventType.GET_THING_TX_RX_BYTES_LOGS;
  macAddress: string;
  logs: ThingTxRxBytesLog[];
};

export type ThingTxRxBytesLog = {
  txBytes: number;
  rxBytes: number;
  loggedAt: Date;
};

export type GetFirmwareResponseType = {
  id: number;
  fileName: string;
  createdAt: Date;
  creator: {
    username: string
  }
}

export type GetFirmwaresResponseType = {
  firmwares: FirmwareResponseType[];
  total: number;
};