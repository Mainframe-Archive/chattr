interface ChannelPayload {
  name: string;
  identities: string[];
}

export interface Channel {
  protocol: string;
  utc_timestamp: number;
  type: string;
  previous_event_pointer: string;
  payload: ChannelPayload;
}

export interface ChattrMeta {
  bzzaccount: string;
  password: string;
  name: string;
  data: string;
}
