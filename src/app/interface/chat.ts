interface ChatPayload {
  body: string;
}

export interface Chat {
  protocol: string;
  utc_timestamp: number;
  type: string;
  previous_event_pointer: string;
  payload: ChatPayload;
}

