export enum UserRoleId {
  ADMIN = 3,
  VIEWER = 2,
  INSTALLATION_TECHNICIAN = 1,
}

export const isAdmin = (id: UserRoleId) => id === UserRoleId.ADMIN

export const getRoleLabelById = (id: UserRoleId): string => {
  switch (id) {
    case UserRoleId.ADMIN:
      return '管理權限'
    case UserRoleId.VIEWER:
      return '監看權限'
    default:
      return '未知'
  }
}

export enum PermissionId {
  OVERVIEW = 0,

  DEVICE_LIST = 10,

  SETTINGS = 20,
}

export enum FunPlayMemberLevel {
  UNKNOWN = 0,
  NORMAL = 1,
  PRO = 2,
}

export const getMemberLevelLabel = (
  memberLevel: FunPlayMemberLevel
): string => {
  switch (memberLevel) {
    case FunPlayMemberLevel.NORMAL:
      return '一般版'
    case FunPlayMemberLevel.PRO:
      return '專業版'
    default:
      return '未知'
  }
}

export enum DialogType {
  Create = 'create',
  Edit = 'edit',
  Delete = 'delete',
  Upload = 'upload',
  Display = 'display',
}

export enum OnlineStatus {
  OFFLINE = 1,
  ONLINE = 2,
}

export enum OverviewPlayingStatusCode {
  STOPPED = 0,
  PLAYING = 1,
}

export enum OverviewGroupCode {
  'central' = 0, // 中區
  'northern' = 1, // 北區
  'southern' = 2, // 南區
  'thm' = 3, // 桃竹苗區
}

export enum OverviewCityCode {
  'unknown' = 0, // 未知
  'tw-yun' = 1, // 雲林縣
  'tw-txg' = 2, // 臺中市
  'tw-ttt' = 3, // 臺東縣
  'tw-tpe' = 4, // 臺北市
  'tw-tnn' = 5, // 臺南市
  'tw-tao' = 6, // 桃園市
  'tw-pif' = 7, // 屏東縣
  'tw-pen' = 8, // 澎湖縣
  'tw-nwt' = 9, // 新北市
  'tw-nan' = 10, // 南投縣
  'tw-mia' = 11, // 苗栗縣
  'tw-lie' = 12, // 連江縣
  'tw-kin' = 13, // 金門縣
  'tw-khh' = 14, // 高雄市
  'tw-kee' = 15, // 基隆市
  'tw-ila' = 16, // 宜蘭縣
  'tw-hua' = 17, // 花蓮縣
  'tw-hsz' = 18, // 新竹市
  'tw-hsq' = 19, // 新竹縣
  'tw-cyq' = 20, // 嘉義縣
  'tw-cyi' = 21, // 嘉義市
  'tw-cha' = 22, // 彰化縣
}

export enum KKBOXLogsSortingColumns {
  ID = 'id',
  DEVICE_LOGGED_AT = 'device_logged_at',
  SERVER_LOGGED_AT = 'server_logged_at',
  CONTENT = 'content',
}

export enum ThingsSortingColumns {
  GROUP_NAME = 'group_name',
  STORE_NAME = 'store_name',
  PLAYING_INFO = 'playing_info',
  ONLINE_STATUS = 'online_status',
  FIRMWARE_VERSION = 'firmware_version',
  LAST_MESSAGE_TIME = 'last_message_time',
}

export enum WsEventType {
  CONNECTION = 'connection',

  ERROR = 'error',

  CLOSE = 'close',

  PING = 'ping',
  PONG = 'pong',

  GET_THING_TX_RX_BYTES_LOGS = 'thing:get-thing-tx-rx-bytes-logs',
}

export enum FirmwaresSortingColumns {
  FIRMWARE_NAME = 'firmware_name',
  CREATED_AT = 'created_at',
  CREATOR = 'creator',
}