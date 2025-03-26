import { ApiClient } from "../api/ApiClient";

export enum DeviceOSType {
  MAC = "MAC",
  LINUX = "LINUX",
  WINDOWS = "WINDOWS",
}

export interface Device {
  id: string;
  system_name: string;
  type: DeviceOSType;
  hdd_capacity: string;
}

/**
 * @name DevicesService
 * @description api service that handles all the devices related API calls
 * Implementation allows swapping the HTTP client (Axios to Fetch or Mock API for testing).
 * */

export class DevicesService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async fetchAllDevices(): Promise<Device[]> {
    return this.apiClient.get<Device[]>("/devices");
  }

  async fetchDevice(deviceId: string): Promise<Device> {
    return this.apiClient.get<Device>(`/devices/${deviceId}`);
  }

  async createDevice(data: Partial<Device>): Promise<Device> {
    return this.apiClient.post<Device>("/devices", data);
  }

  async updateDevice(data: Device): Promise<Device> {
    const deviceId = data.id;
    return this.apiClient.put<Device>(`/devices/${deviceId}`, data);
  }

  async deleteDevice<T>(deviceId: string): Promise<T> {
    return this.apiClient.delete<T>(`/devices/${deviceId}`);
  }
}
