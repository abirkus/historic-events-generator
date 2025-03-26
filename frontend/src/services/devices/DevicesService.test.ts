import { describe, it, expect } from "vitest";
import { DevicesService, DeviceOSType, Device } from "./DevicesService";
import { ApiClient } from "../api/ApiClient";

const mockDevice: Device = {
  id: "1",
  system_name: "Device 1",
  type: DeviceOSType.MAC,
  hdd_capacity: "500GB",
};

describe("DevicesService", () => {
  const apiClientStub: ApiClient = {
    get: jest.fn().mockResolvedValue([{ ...mockDevice }]),
    post: jest
      .fn()
      .mockImplementation((_url: string, body: any) =>
        Promise.resolve({ ...body, id: "123" })
      ),
    put: jest
      .fn()
      .mockImplementation((_url: string, body: any) =>
        Promise.resolve({ ...body })
      ),
    delete: jest.fn().mockResolvedValue({ success: true }),
  };

  const devicesService = new DevicesService(apiClientStub);

  it("should fetch all devices", async () => {
    const devices = await devicesService.fetchAllDevices();

    expect(apiClientStub.get).toHaveBeenCalledWith("/devices");
    expect(devices).toEqual([mockDevice]);
  });

  it("should fetch a single device by id", async () => {
    const device = await devicesService.fetchDevice("1");

    expect(apiClientStub.get).toHaveBeenCalledWith("/devices/1");
    expect(device).toEqual([mockDevice]);
  });

  it("should create a new device", async () => {
    const newDeviceData = {
      system_name: "New Device",
      type: DeviceOSType.WINDOWS,
      hdd_capacity: "1TB",
    };

    const createdDevice = await devicesService.createDevice(newDeviceData);

    expect(apiClientStub.post).toHaveBeenCalledWith("/devices", newDeviceData);
    expect(createdDevice).toEqual({ ...newDeviceData, id: "123" });
  });

  it("should update an existing device", async () => {
    const updatedDeviceData = { ...mockDevice, system_name: "Updated Device" };
    const updatedDevice = await devicesService.updateDevice(updatedDeviceData);

    expect(apiClientStub.put).toHaveBeenCalledWith(
      `/devices/${mockDevice.id}`,
      updatedDeviceData
    );
    expect(updatedDevice).toEqual(updatedDeviceData);
  });

  it("should include correct params when deleting a device", async () => {
    await devicesService.deleteDevice("7");
    expect(apiClientStub.delete).toHaveBeenCalledWith("/devices/7");
  });
});
